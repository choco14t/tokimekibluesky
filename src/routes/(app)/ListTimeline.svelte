<script lang="ts">
    import { agent, userLists } from '$lib/stores';
    import TimelineItem from './TimelineItem.svelte';
    import InfiniteLoading from 'svelte-infinite-loading';
    import { parseISO } from 'date-fns';
    import MediaTimelineItem from "./MediaTimelineItem.svelte";

    export let _agent = $agent;
    export let column;
    export let index;

    let actors = [];
    let cursors = [];
    let il;

    let feedPool = [];
    let feed = [];

    let list = $userLists.find(item => column.algorithm.list === item.id);

    list.members.forEach(member => {
        actors.push({
            actor: member,
            limit: 20,
            cursor: '',
        })
    })

    const handleLoadMore = async ({ detail: { loaded, complete } }) => {
        const ress = await _agent.getTimeline({limit: 20, cursor: '', algorithm: column.algorithm, actors: actors});

        ress.forEach((res, index) => {
            feedPool.push(...res.data.feed);
            cursors.push({
                actor: actors[index].actor,
                cursor: res.data.cursor,
            })
        })
        cursors = cursors;
        feedPool = feedPool.sort((a, b) => {
            if (a.reason) {
                if ( parseISO(a.reason.indexedAt).getTime() < parseISO(b.post.indexedAt).getTime()) {
                    return 1;
                }
            }

            if (b.reason) {
                if ( parseISO(a.post.indexedAt).getTime() < parseISO(b.reason.indexedAt).getTime()) {
                    return 1;
                }
            }

            if ( parseISO(a.post.indexedAt).getTime() < parseISO(b.post.indexedAt).getTime()) {
                return 1;
            }

            if ( parseISO(a.post.indexedAt).getTime() > parseISO(b.post.indexedAt).getTime()) {
                return -1;
            }

            return 0;
        });
        feed = feedPool.slice(0, 20);
        feedPool = feedPool.slice(20);
        console.log(feedPool);

        if (cursors.some(item => item.cursor !== undefined)) {
            await poolRecalc(feedPool);

            /* timeline.update(function (tl) {
                return [...tl, ...feed];
            });
            console.log($timeline) */
            column.data.feed = [...column.data.feed, ...feed];

            loaded();
        } else {
            complete();
        }
    }

    async function poolRecalc(currentPool: []) {
        let feedPerActorMap = new Map();
        list.members.forEach(member => {
            feedPerActorMap.set(member, []);
        });

        currentPool.forEach(feed => {
            if (feed.reason) {
                feedPerActorMap.set(feed.reason.by.did, [...feedPerActorMap.get(feed.reason.by.did), feed])
            } else {
                feedPerActorMap.set(feed.post.author.did, [...feedPerActorMap.get(feed.post.author.did), feed])
            }
        })

        actors = [];
        feedPerActorMap.forEach((value, key) => {
            if (value.length < 20) {
                actors.push({
                    actor: key,
                    limit: 20 - value.length,
                    cursor: cursors.find(item => item.actor === key)?.cursor || undefined
                })
                cursors = cursors.filter(item => item.actor !== key);
            }
        })
        actors = actors;
    }
</script>

{#if (list.members.length)}
  <div class="timeline timeline--{column.style}">
    {#if (column.style === 'default')}
      {#each column.data.feed as data, index (data)}
        <TimelineItem data={ data } index={index} column={column} {_agent}></TimelineItem>
      {/each}
    {:else}
      <div class="media-list">
        {#each column.data.feed as data (data)}
          {#if (data.post.embed?.images)}
            <MediaTimelineItem data={data} {_agent}></MediaTimelineItem>
          {/if}
        {/each}
      </div>
    {/if}

    <InfiniteLoading on:infinite={handleLoadMore} bind:this={il}>
      <p slot="noMore" class="infinite-nomore">もうないよ</p>
    </InfiniteLoading>
  </div>
{:else}
  <div class="timeline timeline--main">
    空のリスト
  </div>
{/if}

<style>

</style>