import UniqueID from '@/utils/uniqueID'

export function pushNotification(state, notification) {
	state.notifications.push({
		...notification,
		id: UniqueID().getID()
	})
}

export function shiftNotification(state, notificationToRemove) {
	state.notifications = state.notifications.filter((notification) => {
		return notification.id !== notificationToRemove.id
	})
}