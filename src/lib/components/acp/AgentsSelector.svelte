<script lang="ts">
    import {agent, agents} from "$lib/stores";
    import {createEventDispatcher} from "svelte";
    import { clickOutside } from '$lib/clickOutSide';
    const dispatch = createEventDispatcher();

  interface Props {
    _agent?: any;
    isDisabled?: boolean;
    style?: string;
  }

  let { _agent = $bindable($agent), isDisabled = false, style = 'default' }: Props = $props();
    let isOpen = $state(false);

    function selectAgent(key, agent) {
        _agent = agent;

        dispatch('select', {
            id: key,
            agent: _agent,
        });

        isOpen = false;
    }
</script>

{#if _agent}
  <div class="agents-selector-wrap agents-selector-wrap--{style}" class:agents-selector-wrap--open={isOpen} aria-disabled={isDisabled}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down agents-selector-wrap-arrow"><path d="m6 9 6 6 6-6"/></svg>

    <div class="agents-selector"
         use:clickOutside={{ignoreElement: '.agents-selector'}}
         onoutclick={() => (isOpen = false)}>
      <button class="agents-selector__item agents-selector__item--front" onclick={() => {isOpen = !isOpen}}>
        <span class="agents-selector__title">@{_agent.agent.session.handle}</span>
      </button>

      <div class="agents-selector__choices">
        {#each $agents as [key, agent]}
          {#if (agent.agent?.session)}
            {#if (agent.agent.session.handle !== _agent.agent.session.handle)}
              <button class="agents-selector__item" onclick={() => {selectAgent(key, agent)}}>
                <span class="agents-selector__title">@{agent.agent.session.handle}</span>
              </button>
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
    .agents-selector-wrap {
        height: 50px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        border-radius: 4px;
        background-color: var(--bg-color-1);
        border: 1px solid var(--border-color-2);
        color: var(--text-color-1);
        z-index: 20;

        &--open {
            overflow: visible;
        }

        &--publish {
            height: 40px;
            font-size: 14px;
            border-bottom: 2px solid var(--primary-color);
            background-color: var(--bg-color-2);
            margin-bottom: 8px;

            .agents-selector {
                border: none;
            }

            .agents-selector__item {
                height: 40px;
                background-color: var(--bg-color-1);
            }
        }

        &[aria-disabled='true'] {
            pointer-events: none;
            opacity: .5;
        }
    }

    .agents-selector-wrap-arrow {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 20px;
        pointer-events: none;
        z-index: 1;
    }

    .agents-selector {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        border-radius: 4px;

        &__item {
            height: 50px;
            width: 100%;
            padding: 0 20px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: flex-start;
            background-color: var(--bg-color-1);
            color: var(--text-color-1);
            text-align: left;

            &:hover {
                background-color: var(--bg-color-2);
            }

            &--front {
                border-top: none;
                padding-bottom: 2px;
            }
        }

        &__title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        &__choices {
            border: 1px solid var(--border-color-2);
            box-shadow: 0 0 10px var(--box-shadow-color-2);
            margin-left: -1px;
            margin-right: -1px;
            margin-top: -1px;
        }
    }
</style>