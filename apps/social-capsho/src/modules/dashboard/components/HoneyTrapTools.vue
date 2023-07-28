<script setup>
  import HoneyTrapCard from '@/modules/dashboard/components/HoneyTrapCard'

  const honeyTrapGuestTools = {
    'Story Based': {
      listName: 'Story Based',
      description: 'These Tools will help you create content honey traps featuring the story shared in the podcast episode you’re promoting',
      tools: [
        {
          title: 'The Paradox',
          route: {
            name: 'Questions',
            params: 'the-paradox-podcast-guest-captions'
          },
          description: 'Intrigue your audience by contrasting the big result your podcast-guest achieved with a surprising / unbelievable fact',
          isEnabled: false
        },
        {
          title: 'The Cliffhanger',
          route: {
            name: 'Questions',
            params: 'the-cliffhanger-podcast-guest-captions'
          },
          description: 'Tempt your audience by sharing the most dramatic moment of your podcast-guest’s story',
          isEnabled: false
        },
        {
          title: 'The Big Reveal',
          route: {
            name: 'Questions',
            params: 'the-big-reveal-podcast-guest-captions'
          },
          description: 'Lure your audience in by hinting at the unexpected twist in your podcast-guest’s story',
          isEnabled: false
        },
        {
          title: 'The Sharer',
          route: {
            name: 'Questions',
            params: 'the-sharer-podcast-guest-captions'
          },
          description: 'Whet your audience’s appetite for the full details of your podcast-guest’s story by giving away the ending',
          isEnabled: false
        }
      ]
    },
    'Tips Based': {
      listName: 'Tips Based',
      description: 'These Tools will help you create content honey traps featuring the tips shared in the podcast episode you’re promoting',
      tools: [
        {
          title: 'The Rebel',
          route: {
            name: 'Questions',
            params: 'the-rebel-podcast-guest-captions'
          },
          description: 'Draw your audience in by alluding to a myth your podcast-guest is busting',
          isEnabled: false
        },
        {
          title: 'The Jawdropper',
          route: {
            name: 'Questions',
            params: 'the-jawdropper-podcast-guest-captions'
          },
          description: 'Entice your audience by teasing a secret your podcast-guest is delving into',
          isEnabled: false
        },
        {
          title: 'The Marvel',
          route: {
            name: 'Questions',
            params: 'the-marvel-podcast-guest-captions'
          },
          description: 'Entice your audience by teasing a secret with a cool name that your podcast-guest is delving into',
          isEnabled: false
        },
        {
          title: 'The Boxer',
          route: {
            name: 'Questions',
            params: 'the-boxer-podcast-guest-captions'
          },
          description: 'Compel your audience by agitating the pain points they are feeling and hinting at the solution your podcast-guest is sharing',
          isEnabled: false
        }
      ]
    }
  }
  const honeyTrapNoGuestTools = {
    'Story Based': {
      listName: 'Story Based',
      description: 'These Tools will help you create content honey traps featuring the story shared in the podcast episode you’re promoting',
      tools: [
        {
          title: 'The Paradox',
          route: {
            name: 'Questions',
            params: 'the-paradox-captions'
          },
          description: 'Intrigue your audience by contrasting the big result you achieved with a surprising / unbelievable fact',
          isEnabled: false
        },
        {
          title: 'The Cliffhanger',
          route: {
            name: 'Questions',
            params: 'the-cliffhanger-captions'
          },
          description: 'Tempt your audience by sharing the most dramatic moment of your story',
          isEnabled: false
        },
        {
          title: 'The Big Reveal',
          route: {
            name: 'Questions',
            params: 'the-big-reveal-captions'
          },
          description: 'Lure your audience in by hinting at the unexpected twist in your story',
          isEnabled: false
        },
        {
          title: 'The Sharer',
          route: {
            name: 'Questions',
            params: 'the-sharer-captions'
          },
          description: 'Whet your audience’s appetite for the full details of your story by giving away the ending',
          isEnabled: false
        }
      ]
    },
    'Tips Based': {
      listName: 'Tips Based',
      description: 'These Tools will help you create content honey traps featuring the tips shared in the podcast episode you’re promoting',
      tools: [
        {
          title: 'The Rebel',
          route: {
            name: 'Questions',
            params: 'the-rebel-captions'
          },
          description: 'Draw your audience in by alluding to a myth you’re busting',
          isEnabled: false
        },
        {
          title: 'The Jawdropper',
          route: {
            name: 'Questions',
            params: 'the-jawdropper-captions'
          },
          description: 'Entice your audience by teasing a secret you’re delving into',
          isEnabled: false
        },
        {
          title: 'The Marvel',
          route: {
            name: 'Questions',
            params: 'the-marvel-captions'
          },
          description: 'Entice your audience by teasing a secret with a cool name that you’re delving into',
          isEnabled: false
        },
        {
          title: 'The Boxer',
          route: {
            name: 'Questions',
            params: 'the-boxer-captions'
          },
          description: 'Compel your audience by agitating the pain points they are feeling and hinting at the solution you are sharing',
          isEnabled: false
        }
      ]
    }
  }
</script>

<template>
  <div class="container">
    <div class="flex flex-row justify-center my-12">
      <div class="flex items-center flex-col w-full">
        <h1 class="font-bold font-bodyLexend banner">
          Honey Trap Tools
        </h1>
        <div class="inner-container w-3/4">
          <div
            v-for="(option, idx) in $route.query.type === 'guest' ? honeyTrapGuestTools : honeyTrapNoGuestTools"
            :key="idx"
            class="text-left"
          >
            <h2 class="text-base font-bold font-heading title mt-12">
              {{ option.listName }}
            </h2>
            <p class="my-4 caption">
              {{ option.description }}
            </p>
            <div class="tools-container">
              <div
                class="row"
              >
                <HoneyTrapCard
                  v-for="(item, i) in option.tools"
                  :key="i"
                  v-bind="item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0px auto;
  padding: 0px 30px;
}

.inner-container {
  width: 100%;
  margin: 0 auto;
}

.tools-container {
  margin-left: -15px;
  margin-right: -15px;
}
.banner {
  font-size: 4rem;
}

.title {
  font-size: 36px;
}

.caption {
  font-size: 17px;
}
</style>
