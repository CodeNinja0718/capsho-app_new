export function addNotification({ commit }, notification) {
	commit('pushNotification', notification)
}

export function removeNotification({ commit }, notification) {
	commit('shiftNotification', notification)
}