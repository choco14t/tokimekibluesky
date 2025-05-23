<script lang="ts">
    import { run } from 'svelte/legacy';

    import {_} from 'svelte-i18n';
    import { settings, theme } from '$lib/stores';
    import {liveQuery} from "dexie";
    import {themesDb} from "$lib/db";
    import {builtInThemes} from "$lib/builtInThemes";
    import {defaultColors} from "$lib/defaultColors";
    import SettingsHeader from "$lib/components/settings/SettingsHeader.svelte";
    import { AppWindowMac, ChevronRight, Columns3, GalleryVertical, Palette, PanelBottomOpen, PanelLeftOpen, RectangleVertical } from "lucide-svelte";
    import {publishState} from "$lib/classes/publishState.svelte";
    import Notice from "$lib/components/ui/Notice.svelte";
    let skin: string = $state($settings?.design.skin || 'default');
    let themePick: string = $state($settings?.design.theme || 'royalblue');
    let fontTheme = $state($settings?.design.fontTheme || 'default');
    let darkmode = $state($settings?.design.darkmode || false);
    let nonoto = $state($settings?.design.nonoto || false);
    let layout = $state($settings?.design.layout || 'decks');
    let datetimeFormat = $state($settings?.design.datetimeFormat || 'yyyy-MM-dd HH:mm');
    let absoluteTime = $state($settings?.design.absoluteTime || false);
    let postsLayout = $state($settings?.design.postsLayout || 'default');
    let postsImageLayout = $state($settings?.design.postsImageLayout || 'default');
    let oneImageNoCrop = $state($settings?.design.oneImageNoCrop || false);
    let fontSize = $state($settings?.design.fontSize || 2);
    let externalLayout = $state($settings?.design.externalLayout || 'normal');
    let mobilePostLayoutTop = $state($settings?.design.mobilePostLayoutTop || false);
    let displayHandle = $state($settings?.design.displayHandle || false);
    let reactionMode = $state($settings?.design.reactionMode || 'tokimeki');
    let leftMode = $state($settings?.design.leftMode || false);
    let disableProfilePopup = $state($settings?.design.disableProfilePopup || false);

    let colors = $derived(detectColors($theme));

    let myThemes = $derived(liveQuery(async () => {
        const myThemes = await themesDb.themes.toArray();
        return myThemes;
    }));

    run(() => {
        $settings.design.skin = skin;
        $settings.design.theme = themePick;
        $settings.design.fontTheme = fontTheme;
        $settings.design.darkmode = darkmode;
        $settings.design.nonoto = nonoto;
        $settings.design.layout = layout;
        $settings.design.absoluteTime = absoluteTime;
        $settings.design.datetimeFormat = datetimeFormat;
        $settings.design.postsLayout = postsLayout;
        $settings.design.postsImageLayout = postsImageLayout;
        $settings.design.oneImageNoCrop = oneImageNoCrop;
        $settings.design.fontSize = fontSize;
        $settings.design.externalLayout = externalLayout;
        $settings.design.mobilePostLayoutTop = mobilePostLayoutTop;
        $settings.design.displayHandle = displayHandle;
        $settings.design.reactionMode = reactionMode;
        $settings.design.leftMode = leftMode;
        $settings.design.disableProfilePopup = disableProfilePopup;
    });

    const datetimeFormats = [
        {
            sample: '2023-10-15 11:32',
            value: 'yyyy-MM-dd HH:mm',
        },
        {
            sample: '23/10/15 11:32',
            value: 'yy/MM/dd HH:mm',
        },
        {
            sample: '10/15/23 11:32',
            value: 'MM/dd/yy HH:mm',
        },
        {
            sample: '15/10/23 11:32',
            value: 'dd/MM/yy HH:mm',
        },
    ];

    function detectColors(theme) {
        if (!theme) {
            return false;
        }

        if (theme.options.colors) {
            if (Array.isArray(theme.options.colors)) {
                return theme.options.colors;
            }
        }

        return defaultColors;
    }
</script>

<svelte:head>
  <title>{$_('settings_design')} - TOKIMEKI</title>
</svelte:head>

<div>
  <SettingsHeader>
    {$_('settings_design')}
  </SettingsHeader>

  <div class="settings-wrap">
    <div class="settings-child-nav">
      <GalleryVertical size="24"></GalleryVertical>
      <a href="/settings/design/embed">{$_('settings_embed')}<br><span>{$_('settings_embed_description')}</span></a>
      <ChevronRight size="20"></ChevronRight>
    </div>

    <div class="settings-child-nav">
      <Palette size="24"></Palette>
      <a href="/theme-store">{$_('theme_store')}<br><span>{$_('theme_store_description')}</span></a>
      <ChevronRight size="20"></ChevronRight>
    </div>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('publish_position')}
      </dt>

      <dd class="settings-group__content">
        <div class="radio-group">
          <div class="radio radio--boxed">
            <input type="radio" bind:group={publishState.layout} id="publishPositionLeft" name="publishPosition" value={'left'}>
            <label for="publishPositionLeft">
              <span class="radio__ui"></span>
              <PanelLeftOpen size="16"></PanelLeftOpen>
              {$_('publish_position_left')}
            </label>
          </div>

          <div class="radio radio--boxed">
            <input type="radio" bind:group={publishState.layout} id="publishPositionBottom" name="publishPosition" value={'bottom'}>
            <label for="publishPositionBottom">
              <span class="radio__ui"></span>
              <PanelBottomOpen size="16"></PanelBottomOpen>
              {$_('publish_position_bottom')}
            </label>
          </div>

          <div class="radio radio--boxed">
            <input type="radio" bind:group={publishState.layout} id="publishPositionPopup" name="publishPosition" value={'popup'}>
            <label for="publishPositionPopup">
              <span class="radio__ui"></span>
              <AppWindowMac size="16"></AppWindowMac>
              {$_('publish_position_popup')}
            </label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('layout')}
      </dt>

      <dd class="settings-group__content">
        <div class="layout-radio-group">
          <div class="layout-radio" class:layout-radio--current={$settings.design?.layout === 'decks'}>
            <input type="radio" bind:group={layout} id="layoutDecks" name="layout" value={'decks'}>
            <label for="layoutDecks">
              <Columns3 size="22" color="var(--radio-current-color)"></Columns3>
              {$_('layout_decks')}
            </label>
          </div>

          <div class="layout-radio" class:layout-radio--current={$settings.design?.layout === 'default'}>
            <input type="radio" bind:group={layout} id="layoutDefault" name="layout" value={'default'}>
            <label for="layoutDefault">
              <RectangleVertical size="22" color="var(--radio-current-color)"></RectangleVertical>
              {$_('layout_single')}
            </label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('skin_theme')}
      </dt>

      <dd class="settings-group__content">
        <div class="icons-radio-group icons-radio-group--grid">
          {#each builtInThemes as _skin}
            <div class="icons-radio icons-radio--skin">
              <input type="radio" bind:group={skin} id="skin_{_skin.id}" name="skin" value={_skin.name}>
              <label for="skin_{_skin.id}">
                <span class="icons-radio__ui">
                  <img src={_skin.options?.thumbnail} alt="">
                </span>{$_('skin_' + _skin.name)}
              </label>
            </div>
          {/each}

          {#if $myThemes}
            {#each $myThemes as _skin}
              <div class="icons-radio icons-radio--skin icons-radio--skin-dl">
                <input type="radio" bind:group={skin} id="skin_{_skin.id}" name="skin" value={_skin.id}>
                <label for="skin_{_skin.id}">
                <span class="icons-radio__ui">
                  <img src={_skin.options?.thumbnail} alt="">
                </span>{_skin.name}
                </label>
              </div>
            {/each}
          {/if}
        </div>

        <p class="theme-store-link"><a href="/theme-store"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>{$_('theme_store')}</a></p>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('color_theme')}
      </dt>

      <dd class="settings-group__content">
        {#if $theme ? $theme.options?.colorDisabled : false}
          <Notice text={$_('color_disabled_theme')}></Notice>
        {/if}

        <ul class="theme-picker theme-picker--{themePick}">
          {#if (colors)}
            {#each colors as color}
              <li
                  class="theme-picker__item"
                  class:theme-picker__item--current={themePick === color.id}
              >
                <button
                    class="theme-picker__button"
                    onclick={() => {themePick = color.id}}
                    aria-label=""
                    style:background={color.colorCode}></button>
              </li>
            {/each}
          {/if}
        </ul>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('font_theme')}
      </dt>

      <dd class="settings-group__content">
        <div class="radio-group">
          <div class="radio">
            <input type="radio" bind:group={fontTheme} id="fontThemeNoto" name="fontTheme" value={'default'}>
            <label for="fontThemeNoto"><span class="radio__ui"></span>Noto Sans</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={fontTheme} id="fontThemeZenMaru" name="fontTheme" value={'zenmaru'}>
            <label for="fontThemeZenMaru"><span class="radio__ui"></span>Zen Maru Gothic</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={fontTheme} id="fontThemeMurecho" name="fontTheme" value={'murecho'}>
            <label for="fontThemeMurecho"><span class="radio__ui"></span>Murecho</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('darkmode')}
      </dt>

      <dd class="settings-group__content">
        {#if $theme ? $theme.options?.darkmodeDisabled : false}
          <Notice text={$_('darkmode_disabled_theme')}></Notice>
        {/if}

        <div class="radio-group">
          <div class="radio">
            <input type="radio" bind:group={darkmode} id="darkmodeFalse" name="darkmode" value={false}>
            <label for="darkmodeFalse"><span class="radio__ui"></span>{$_('light')}</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={darkmode} id="darkmodeTrue" name="darkmode" value={true}>
            <label for="darkmodeTrue"><span class="radio__ui"></span>{$_('dark')}</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={darkmode} id="darkmodePrefer" name="darkmode" value={'prefer'}>
            <label for="darkmodePrefer"><span class="radio__ui"></span>{$_('prefer')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('posts_font_size')}
      </dt>

      <dd class="settings-group__content">
        <div class="range">
          <input class="range__input" type="range" min="1" max="5" step="1" bind:value={fontSize} list="fontSize">
          <datalist id="fontSize" class="range__datalist">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
          </datalist>
        </div>
      </dd>
    </dl>


    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('posts_layout')}
      </dt>

      <dd class="settings-group__content">
        <div class="icons-radio-group">
          <div class="icons-radio">
            <input type="radio" bind:group={postsLayout} id="postsLayoutDefault" name="posts_layout" value={'default'}>
            <label for="postsLayoutDefault"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g data-name="グループ 116" transform="translate(-663 -402)"><g class="icons-radio__g" data-name="長方形 110" transform="translate(663 402)" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><circle data-name="楕円形 44" cx="9" cy="9" r="9" transform="translate(668 408)" fill="var(--border-color-2)"/><circle data-name="楕円形 45" cx="9" cy="9" r="9" transform="translate(668 431)" fill="var(--border-color-2)"/><circle data-name="楕円形 46" cx="9" cy="9" r="9" transform="translate(668 454)" fill="var(--border-color-2)"/><path data-name="長方形 111" fill="var(--border-color-2)" d="M691 410h23v4h-23z"/><path data-name="長方形 114" fill="var(--border-color-2)" d="M691 433h23v4h-23z"/><path data-name="長方形 116" fill="var(--border-color-2)" d="M691 456h23v4h-23z"/><path data-name="長方形 112" fill="var(--border-color-2)" d="M691 417h41v5h-41z"/><path data-name="長方形 113" fill="var(--border-color-2)" d="M691 440h41v5h-41z"/><path data-name="長方形 115" fill="var(--border-color-2)" d="M691 463h41v5h-41z"/></g></svg></span>{$_('default')}</label>
          </div>

          <div class="icons-radio">
            <input type="radio" bind:group={postsLayout} id="postsLayoutCompact" name="posts_layout" value={'compact'}>
            <label for="postsLayoutCompact"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><defs><linearGradient id="a" x1=".5" x2=".5" y2=".749" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="var(--bg-color-1)" stop-opacity="0"/><stop offset="1" stop-color="var(--bg-color-1)"/></linearGradient></defs><g data-name="グループ 117" transform="translate(-756 -402)"><g class="icons-radio__g" data-name="長方形 117" transform="translate(756 402)" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><circle data-name="楕円形 47" cx="7.5" cy="7.5" r="7.5" transform="translate(761 406)" fill="var(--border-color-2)"/><circle data-name="楕円形 48" cx="7.5" cy="7.5" r="7.5" transform="translate(761 424)" fill="var(--border-color-2)"/><circle data-name="楕円形 49" cx="7.5" cy="7.5" r="7.5" transform="translate(761 442)" fill="var(--border-color-2)"/><circle data-name="楕円形 50" cx="7.5" cy="7.5" r="7.5" transform="translate(761 460)" fill="var(--border-color-2)"/><path data-name="長方形 123" fill="var(--border-color-2)" d="M781 408h23v3h-23z"/><path data-name="長方形 125" fill="var(--border-color-2)" d="M781 426h23v3h-23z"/><path data-name="長方形 127" fill="var(--border-color-2)" d="M781 444h23v3h-23z"/><path data-name="長方形 129" fill="var(--border-color-2)" d="M781 462h23v3h-23z"/><path data-name="長方形 122" fill="var(--border-color-2)" d="M781 413h41v4h-41z"/><path data-name="長方形 124" fill="var(--border-color-2)" d="M781 431h41v4h-41z"/><path data-name="長方形 126" fill="var(--border-color-2)" d="M781 449h41v4h-41z"/><path data-name="長方形 128" fill="var(--border-color-2)" d="M781 467h41v4h-41z"/><rect data-name="長方形 130" width="73" height="26" rx="4" transform="translate(757 450)" fill="url(#a)"/></g></svg></span>{$_('compact')}</label>
          </div>

          <div class="icons-radio">
            <input type="radio" bind:group={postsLayout} id="postsLayoutMinimum" name="posts_layout" value={'minimum'}>
            <label for="postsLayoutMinimum"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g data-name="グループ 118"><g class="icons-radio__g" data-name="長方形 131" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><path data-name="長方形 132" fill="var(--border-color-2)" d="M8 5h23v3H8z"/><path data-name="長方形 135" fill="var(--border-color-2)" d="M8 20h23v3H8z"/><path data-name="長方形 137" fill="var(--border-color-2)" d="M8 33h23v3H8z"/><path data-name="長方形 139" fill="var(--border-color-2)" d="M8 48h23v3H8z"/><path data-name="長方形 141" fill="var(--border-color-2)" d="M8 61h23v3H8z"/><path data-name="長方形 133" fill="var(--border-color-2)" d="M8 10h59v4H8z"/><path data-name="長方形 134" fill="var(--border-color-2)" d="M8 25h59v4H8z"/><path data-name="長方形 136" fill="var(--border-color-2)" d="M8 38h59v4H8z"/><path data-name="長方形 138" fill="var(--border-color-2)" d="M8 53h59v4H8z"/><path data-name="長方形 140" fill="var(--border-color-2)" d="M8 66h59v4H8z"/></g></svg></span>{$_('minimum')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('posts_image_layout')}
      </dt>

      <dd class="settings-group__content">
        <div class="icons-radio-group">
          <div class="icons-radio">
            <input type="radio" bind:group={postsImageLayout} id="postsImageLayoutDefault" name="posts_image_layout" value={'default'}>
            <label for="postsImageLayoutDefault"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g data-name="グループ 119" transform="translate(-663 -536)"><g class="icons-radio__g" data-name="長方形 142" transform="translate(663 536)" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><rect class="icons-radio__r" data-name="長方形 144" width="26" height="26" rx="4" transform="translate(672 545)" fill="var(--border-color-2)"/><rect class="icons-radio__r" data-name="長方形 147" width="26" height="26" rx="4" transform="translate(672 576)" fill="var(--border-color-2)"/><rect class="icons-radio__r" data-name="長方形 145" width="26" height="26" rx="4" transform="translate(703 545)" fill="var(--border-color-2)"/><rect class="icons-radio__r" data-name="長方形 146" width="26" height="26" rx="4" transform="translate(703 576)" fill="var(--border-color-2)"/></g></svg></span>{$_('default')}</label>
          </div>

          <div class="icons-radio">
            <input type="radio" bind:group={postsImageLayout} id="postsImageLayoutCompact" name="posts_image_layout" value={'compact'}>
            <label for="postsImageLayoutCompact"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g data-name="グループ 120"><g class="icons-radio__g" data-name="長方形 148" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><g data-name="グループ 115" transform="translate(-756 -516)" fill="var(--border-color-2)"><rect class="icons-radio__r" data-name="長方形 151" width="14" height="14" rx="2" transform="translate(763 547)"/><rect class="icons-radio__r" data-name="長方形 152" width="14" height="14" rx="2" transform="translate(779 547)"/><rect class="icons-radio__r" data-name="長方形 153" width="14" height="14" rx="2" transform="translate(795 547)"/><rect class="icons-radio__r" data-name="長方形 154" width="14" height="14" rx="2" transform="translate(811 547)"/></g></g></svg></span>{$_('compact')}</label>
          </div>

          <div class="icons-radio">
            <input type="radio" bind:group={postsImageLayout} id="postsImageLayoutMinimum" name="posts_image_layout" value={'folding'}>
            <label for="postsImageLayoutMinimum"><span class="icons-radio__ui"><svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g data-name="グループ 121"><g class="icons-radio__g" data-name="長方形 148" fill="var(--bg-color-1)" stroke="var(--border-color-1)"><rect width="75" height="75" rx="4" stroke="none"/><rect x=".5" y=".5" width="74" height="74" rx="3.5" fill="none"/></g><g data-name="グループ 115" transform="translate(-737 -520)"><rect class="icons-radio__r" data-name="長方形 151" width="24" height="6" rx="2" transform="translate(763 555)" fill="var(--border-color-2)"/></g></g></svg></span>{$_('folding')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('external_embed_layout')}
      </dt>

      <dd class="settings-group__content">
        <div class="icons-radio-group">
          <div class="icons-radio">
            <input type="radio" bind:group={externalLayout} id="externalLayoutDefault" name="external_layout" value={'normal'}>
            <label for="externalLayoutDefault"><span class="icons-radio__ui">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g id="グループ_119" data-name="グループ 119" transform="translate(-663 -536)"><g class="icons-radio__g" id="長方形_142" data-name="長方形 142" transform="translate(663 536)" fill="var(--bg-color-1)" stroke="var(--border-color-1)" stroke-width="1"><rect width="75" height="75" rx="4" stroke="none"/><rect x="0.5" y="0.5" width="74" height="74" rx="3.5" fill="none"/></g><rect class="icons-radio__r" id="長方形_144" data-name="長方形 144" width="57" height="31" rx="4" transform="translate(672 545)" fill="var(--border-color-2)"/><rect class="icons-radio__r" id="長方形_144-2" data-name="長方形 144" width="57" height="7" rx="3.5" transform="translate(672 580)" fill="var(--border-color-2)"/><rect class="icons-radio__r" id="長方形_144-3" data-name="長方形 144" width="57" height="3" rx="1.5" transform="translate(672 591)" fill="var(--border-color-2)"/><rect class="icons-radio__r" id="長方形_144-4" data-name="長方形 144" width="57" height="3" rx="1.5" transform="translate(672 598)" fill="var(--border-color-2)"/></g></svg></span>{$_('default')}</label>
          </div>

          <div class="icons-radio">
            <input type="radio" bind:group={externalLayout} id="externalLayoutCompact" name="external_layout" value={'compact'}>
            <label for="externalLayoutCompact"><span class="icons-radio__ui">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g id="グループ_119" data-name="グループ 119" transform="translate(-663 -536)"><g class="icons-radio__g" id="長方形_142" data-name="長方形 142" transform="translate(663 536)" fill="var(--bg-color-1)" stroke="var(--border-color-1)" stroke-width="1"><rect width="75" height="75" rx="4" stroke="none"/><rect x="0.5" y="0.5" width="74" height="74" rx="3.5" fill="none"/></g><rect class="icons-radio__r" id="長方形_144" data-name="長方形 144" width="57" height="7" rx="3.5" transform="translate(672 563)" fill="var(--border-color-2)"/><rect class="icons-radio__r" id="長方形_144-2" data-name="長方形 144" width="57" height="3" rx="1.5" transform="translate(672 574)" fill="var(--border-color-2)"/><rect class="icons-radio__r" id="長方形_144-3" data-name="長方形 144" width="57" height="3" rx="1.5" transform="translate(672 581)" fill="var(--border-color-2)"/></g></svg></span>{$_('compact')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('one_image_no_crop')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="oneImageNoCrop" bind:checked={oneImageNoCrop}><label class="input-toggle__label" for="oneImageNoCrop"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('bubble_timeline')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="bubbleTimeline" bind:checked={$settings.design.bubbleTimeline}><label class="input-toggle__label" for="bubbleTimeline"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('do_not_use_noto_sans')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="nonoto" bind:checked={nonoto}><label class="input-toggle__label" for="nonoto"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('display_handle')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="displayHandle" bind:checked={displayHandle}><label class="input-toggle__label" for="displayHandle"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('reaction_mode')}
      </dt>

      <dd class="settings-group__content">
        <div class="radio-group">
          <div class="radio">
            <input type="radio" bind:group={reactionMode} id="reactionModeTokimeki" name="reactionMode" value={'tokimeki'}>
            <label for="reactionModeTokimeki"><span class="radio__ui"></span>{$_('reaction_mode_tokimeki')}</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={reactionMode} id="reactionModeSuperstar" name="reactionMode" value={'superstar'}>
            <label for="reactionModeSuperstar"><span class="radio__ui"></span>{$_('reaction_mode_superstar')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('use_absolute_time')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="absoluteTime" bind:checked={absoluteTime}><label class="input-toggle__label" for="absoluteTime"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('datetime_format')}
      </dt>

      <dd class="settings-group__content">
        <div class="select">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="select__icon lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>

          <select class="select__input" bind:value={datetimeFormat}>
            {#each datetimeFormats as option}
              <option value="{option.value}">{option.sample}</option>
            {/each}
          </select>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('mobile_post_layout')}
      </dt>

      <dd class="settings-group__content">
        <div class="radio-group">
          <div class="radio">
            <input type="radio" bind:group={mobilePostLayoutTop} id="mobilePostLayoutFalse" name="mobilePostLayout" value={false}>
            <label for="mobilePostLayoutFalse"><span class="radio__ui"></span>{$_('mobile_post_layout_bottom')}</label>
          </div>

          <div class="radio">
            <input type="radio" bind:group={mobilePostLayoutTop} id="mobilePostLayoutTrue" name="mobilePostLayout" value={true}>
            <label for="mobilePostLayoutTrue"><span class="radio__ui"></span>{$_('mobile_post_layout_top')}</label>
          </div>
        </div>
      </dd>
    </dl>

    <dl class="settings-group only-mobile">
      <dt class="settings-group__name">
        {$_('left_mode')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="leftMode" bind:checked={leftMode}><label class="input-toggle__label" for="leftMode"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group only-pc">
      <dt class="settings-group__name">
        {$_('disable_profile_popup')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="disableProfilePopup" bind:checked={disableProfilePopup}><label class="input-toggle__label" for="disableProfilePopup"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group">
      <dt class="settings-group__name">
        {$_('display_mutual_following')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="displayMutualDisplay" bind:checked={$settings.design.mutualDisplay}><label class="input-toggle__label" for="displayMutualDisplay"></label>
        </div>
      </dd>
    </dl>

    <dl class="settings-group only-mobile">
      <dt class="settings-group__name">
        {$_('mobile_new_ui')}
      </dt>

      <dd class="settings-group__content">
        <div class="input-toggle">
          <input class="input-toggle__input" type="checkbox" id="mobileNewUi" bind:checked={$settings.design.mobileNewUi}><label class="input-toggle__label" for="mobileNewUi"></label>
        </div>
      </dd>
    </dl>
  </div>
</div>

<style lang="postcss">
    .theme-picker {
        display: grid;
        grid-template-columns: repeat(6, 50px);
        gap: 6px;
        list-style: none;
        margin-top: 10px;

        &__item {
            aspect-ratio: 1 / 1;
            border-radius: var(--primary-color);

            &--current {
                button {
                    border: 2px solid var(--text-color-1);
                }
            }
        }

        &__button {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            border: 2px solid rgba(0, 0, 0, .1);
        }
    }

    .theme-store-link {
        margin-top: 16px;

        a {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
    }
</style>