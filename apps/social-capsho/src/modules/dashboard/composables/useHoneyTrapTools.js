import { readonly, ref } from 'vue'

export function useHoneyTrapTools() {
	const tools = ref({
		'About me': {
			name: 'About me',
			route: {
				name: 'Questions',
				params: 'about-me'
			},
			description: 'Introduce yourself to your audience in a fun, unique and personal way',
			isEnabled: false
		},
		'Promised Land': {
			name: 'Promised Land',
			route: {
				name: 'Questions',
				params: 'promised-land'
			},
			description: 'Inspire your audience with how you reached an aspiration they have',
			isEnabled: false
		},
		'Striking memory': {
			name: 'Striking memory',
			route: {
				name: 'Questions',
				params: 'a-striking-memory'
			},
			description: 'Captivate your audience on a topic they care about with a story from your past ',
			isEnabled: false
		},
		'Moment in time': {
			name: 'Moment in time',
			route: {
				name: 'Questions',
				params: 'every-day-moment-in-time'
			},
			description: 'Engage your audience with an emotion they want to feel',
			isEnabled: false
		},
		'How-to': {
			name: 'How-to',
			route: {
				name: 'Questions',
				params: 'how-to'
			},
			description: 'Educate your audience on something they want to know how to do ',
			isEnabled: false
		},
		'Product spotlight': {
			name: 'Product spotlight',
			route: {
				name: 'Questions',
				params: 'product-spotlight'
			},
			description: 'Excite your audience about a hero product or collection that\'s available to buy',
			isEnabled: false
		},
		'Content Honey Trap': {
			name: 'Content Honey Trap',
			route: {
				name: 'GetTheRightHoneyTrap',
				params: 'get-the-right-honey-trap'
			},
			description: 'Create insatiable curiosity in your audience and compel them to listen to your latest podcast episode',
			isEnabled: false
		}
	})

	const updateTool = ({name}) => {
		if (tools.value[name].isEnabled) {
			tools.value[name] = {
				...tools.value[name],
				isEnabled: false
			}
		} else {
			tools.value[name] = {
				...tools.value[name],
				isEnabled: true
			}
		}
	}

	return {
		tools: readonly(tools),
		updateTool
	}
}
