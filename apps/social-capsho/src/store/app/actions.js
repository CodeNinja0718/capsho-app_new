/**
 *
 * @param commit
 * @param user
 */
export function fetchUser({ commit }, user) {
	commit('logIn', user !== null)
	if (user) {
		commit('setUserData', {
			displayName: user.displayName,
			email: user.email,
			photoURL: user.photoURL,
			emailVerified: user.emailVerified,
			id: user.uid
		})
	} else {
		commit('setUserData', null)
	}
}