const express = require('express');
const { Op } = require('sequelize');
const router = express.Router({ mergeParams: true });
const { Friend, User, FriendNotification, Cardset, Flashcard } = require('../models/modelRelations');
const { Sequelize } = require('sequelize');

async function getAllFriends (currentUserId) {
    try{
        //Looks for entries where userid is either the requestor or requestee
        const existingEntry = await Friend.findAll({
            where: {
                [Op.or]: [
                    {
                        user1Id: currentUserId,
                    },
                    {
                        user2Id: currentUserId
                    }
                ],
                status: 'accepted'
            },
            attributes: ['user1Id', 'user2Id', 'status', 'createdAt']
        });
        return existingEntry;
    } catch (error) {
        throw new Error('Error getting users friends: ' + error.message);
    }
}

async function getAllFriendRequests (currentUserId) {
    try{
        //Looks for entries where userid is either the requestor or requestee
        const existingEntry = await Friend.findAll({
            where: {
                [Op.or]: [
                    {
                        user1Id: currentUserId,
                    },
                    {
                        user2Id: currentUserId
                    }
                ],
                status: 'pending'
            },
            attributes: ['user1Id', 'user2Id', 'status', 'createdAt']
        });
        return existingEntry;
    } catch (error) {
        throw new Error('Error getting users friends: ' + error.message);
    }
}

async function getExistingFriendEntry (user1Id, user2Id) {
    try{
        //Looks for an entry of the relationship between two users
        const existingEntry = await Friend.findOne({
            where: {
                [Op.or]: [
                    {
                        user1Id: user1Id,
                        user2Id: user2Id
                    },
                    {
                        user1Id: user2Id,
                        user2Id: user1Id
                    }
                ]
            }
        });
        return existingEntry;
    } catch (error) {
        throw new Error('Error getting friend entry: ' + error.message);
    }
}

async function deleteFriendEntry (existingEntry) {
    try {
        const friendNotif = await FriendNotification.findOne({
            where:{
                [Op.or]: [
                {
                    recipientId: existingEntry.user1Id,
                    senderId: existingEntry.user2Id,
                    type: 'pending'
                },
                {
                    recipientId: existingEntry.user2Id,
                    senderId: existingEntry.user1Id,
                    type: 'pending'
                },
                ]
            }
        });
        if (friendNotif){
            friendNotif.destroy();
        }
        await existingEntry.destroy();
        return { success: true, message: 'Entry deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting friend entry: ' + error.message);
    }
}

async function acceptFriendRequest (existingRequest) {
    try{
        const friendNotif = await FriendNotification.findOne({
            where:{
                recipientId: existingRequest.user2Id,
                senderId: existingRequest.user1Id
            }
        });
        if (friendNotif){
            friendNotif.destroy();
        }
        const updatedRequest = await existingRequest.update({status: 'accepted'});
        return updatedRequest;
    } catch (error) {
        throw new Error('Error accepting friend request: ' + error.message);
    }
}

async function createFriendRequest (user1Id, user2Id) {
    try{
        const user = await User.findByPk(user1Id);
        const user2 = await User.findByPk(user2Id);
        const newRequest = await user.addFriend(user2);
        return newRequest;
    } catch (error) {
        throw new Error('Error creating friend request: ' + error.message);
    }
}

async function createFriendNotif (recipientId, senderId, type) {
    try{
        const recipient = await User.findByPk(recipientId);
        await recipient.createFriendNotification({type: type, senderId: senderId})
        return;
    } catch (error) {
        throw new Error('Error creating friend notification: ' + error.message);
    }
}

async function restructureFriendData(friends, currentUserId){
    try{
        const restructuredData = await Promise.all(friends.map(async (friendData) => {
            const { user1Id, user2Id, status, createdAt } = friendData;
            const otherUserId = user1Id === currentUserId ? user2Id : user1Id;
            const otherUser = await User.findByPk(otherUserId);
            
            // get the other user public cardsets
            const publicCardsets = await Cardset.findAll({
                where: {
                    userId: otherUserId,
                    isPublic: true
                },
                include: [{
                    model: Flashcard,
                    attributes: [],
                    duplicating: false,
                }],
                attributes: {
                    include: [
                        [Sequelize.fn("COUNT", Sequelize.col("flashcards.id")), "flashcardCount"]
                    ]
                },
                group: ['cardsetId']
            });

            let requestDirection = 'completed';
            if (status !== 'accepted') {
                requestDirection = user1Id === currentUserId ? 'outgoing' : 'incoming';
            }
            return {
                id: otherUser.id,
                username: otherUser.username,
                email: otherUser.email,
                requestDirection,
                status,
                createdAt,
                publicCardsets
            };
        }));
        return restructuredData;
    } catch (error) {
        throw new Error('Error restructuring friend data: ' + error.message);
    }
}

//Routes for getting, adding, and deleting friends
//uses api route of /api/users/:userid/friends
router.route('/')
//Get all of a user's friends and friend requests
.get(async (req, res) => {  
    try{
        const user = await User.findByPk(req.params.userid);
        if (user) {
            const friends = await getAllFriends(req.params.userid);
            const structuredData = await restructureFriendData(friends, parseInt(req.params.userid));
            return res.status(200).json(structuredData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching users friends: ', error);
        res.status(500).json({ error: 'Error fetching users friends' });
    }
})
//Create OR accept a friend request
.post(async (req, res) => {
    try {
        //Can pass any one of the three user identifiers
        let { friendId, username, email } = req.body;
        if(username){
            const friendUser = await User.findOne({where: {username: username}});
            if (friendUser) {
                friendId = await friendUser.id;
            } else{
                return res.status(404).json({message: 'Target User does not exist'});
            }
        } else if (email) {
            const friendUser = await User.findOne({where: {email: email}});
            if (friendUser) {
                friendId = await friendUser.id;
            } else{
                return res.status(404).json({message: 'Target user does not exist'});
            }
        }
        const existingEntry = await getExistingFriendEntry(req.params.userid, friendId);
        //If user already made a request, send response and return
        if (existingEntry && existingEntry.status === 'pending' && existingEntry.user1Id === parseInt(req.params.userid)) {
            return res.status(200).json({ message: 'User already has a pending request to this user'});
        }
        //If request exists from other user, accept the existing request
        if (existingEntry && existingEntry.status !== 'accepted' && existingEntry.user1Id != parseInt(req.params.userid)) {
            const updatedEntry = await acceptFriendRequest(existingEntry);
            await createFriendNotif(friendId, req.params.userid, 'confirmed');
            return res.status(200).json(updatedEntry);
        }
        //If request doesn't exist, create one 
        else if (!existingEntry) {
            const newEntry = await createFriendRequest(req.params.userid, friendId);
            await createFriendNotif(friendId, req.params.userid, 'pending');
            return res.status(201).json(newEntry);
        } 
        //Otherwise, users are already friends.
        else{
            res.status(200).json({ message: 'Users are already friends' });
        }
    } catch (error) {
        console.error('Error sending/accepting friend request: ', error);
        res.status(500).json({ error: 'Error sending/accepting friend request'});
    }
})
//Delete a friend request or an accepted friend entry
.delete(async (req, res) => {
    try{
        const { friendId } = req.body;
        const existingEntry = await getExistingFriendEntry(req.params.userid, friendId);
        if (existingEntry) {
            console.log(existingEntry.status);
            if (existingEntry.status === 'accepted') {
                console.log("RUNNING");
                await createFriendNotif(friendId, req.params.userid, 'unfriended');
            } else if (existingEntry.user1Id !== req.params.userid && existingEntry.status === 'pending'){
                await createFriendNotif(friendId, req.params.userid, 'denied');
            }
            await deleteFriendEntry(existingEntry);
            return res.status(204).send();
        } else {
            res.status(404).json({ error: 'Friend entry not found' })
        }
    } catch (error) {
        console.error('Error deleting friend entry: ', error);
        res.status(500).json({ error: 'Error deleting friend entry' });
    }
});

//Users incoming and outgoing friend requests
router.route('/requests')
.get(async (req, res) => {
    try{
        const user = await User.findByPk(req.params.userid);
        if (user) {
            const friends = await getAllFriendRequests(req.params.userid);
            const structuredData = await restructureFriendData(friends, parseInt(req.params.userid));
            return res.status(200).json(structuredData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching users friends: ', error);
        res.status(500).json({ error: 'Error fetching users friends' });
    }
});

//Check if a user is friends with another user
router.route('/:friendId')
.get(async (req, res) => {
    try{
        const existingEntry = await getExistingFriendEntry(req.params.userid, req.params.friendId);
        if (existingEntry){
            return res.status(200).json(existingEntry);
        } else {
            return res.status(404).json({message: 'Users are not friends and have no pending requests'});
        }
    } catch (error){
        console.error('Error checking friendship status: ', error);
        res.status(500).json({ error: 'Error checking friendship status' });
    }
});

module.exports = router;