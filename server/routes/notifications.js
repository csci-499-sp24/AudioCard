const express = require('express');
const router = express.Router({ mergeParams: true });
const { Cardset, User, FriendNotification, CardsetNotification } = require('../models/modelRelations');

router.route('/')
.get(async (req, res) => {
    try {
        const userNotifications = await User.findByPk(req.params.userid, {
            attributes: [],
            include: [
                {
                    model: FriendNotification,
                    attributes: ['id', 'type', 'createdAt'],
                    include: [
                        {
                            model: User,
                            required: true,
                            as: 'sender',
                            attributes: ['id', 'username']
                        },
                    ]
                },
                {
                    model: CardsetNotification,
                    attributes: ['id', 'type', 'authority','createdAt'],
                    include: [
                        {
                            model: User,
                            required: true,
                            as: 'sender',
                            attributes: ['id', 'username']
                        },
                        {
                            model: Cardset,
                            required: true,
                            as: 'cardset',
                            attributes: ['id', 'title']
                        }
                    ]
                }
            ]
        });
        const mergedNotifications = [...userNotifications.friendNotifications, ...userNotifications.cardsetNotifications]
        mergedNotifications.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        return res.status(200).json(mergedNotifications.reverse());
    } catch (error) {
        console.error("Error getting user's notifications:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.route('/cardsetNotifications/:notificationid')
.delete(async (req, res) => {//For deleting cardset notifications
    try { 
        const {notificationid} = req.params;
        const notification = await CardsetNotification.findByPk(notificationid);
        if (notification.type === 'request') {
            const user = await User.findByPk(notification.senderId);
            await user.createCardsetNotification({
                senderId: req.params.userid, 
                cardsetId: notification.cardsetId, 
                type: 'requestDenied', 
                authority: notification.authority
            })
        }
        await notification.destroy();
        res.status(200).send('Notification deleted');
    } catch (error) {
        console.error("Error deleting cardset notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.route('/friendNotifications/:notificationid')
.delete(async (req, res) => {//For deleting declined/unfriended/confirmation friend notifications
    try { 
        const {notificationid} = req.params;
        const notification = await FriendNotification.findByPk(notificationid);
        await notification.destroy();
        res.status(200).send('Notification deleted');
    } catch (error) {
        console.error("Error deleting friend notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;