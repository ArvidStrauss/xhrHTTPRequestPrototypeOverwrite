/** ######################## **/
/* _$PROJECT$_ Custom Overrides _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

/**
 * This file contains all customer specific adjustments in addition to the feature toggles
 */

// this replaces the internal coyo-names by the ones, the customer wants (like german translations)
coyoTrackingUtils.OVERRIDES = {
  // this struct is used by coyoTrackingUtils.typeNameOverrides and replaces everything in eventtracking params and custom dimensions
  TYPE: {
      'pages': 'Seiten',
      'page': 'Seite',
      'home': 'Startseite',
      'workspaces': 'Arbeitsräume',
      'arbeitsraeume': 'Arbeitsräume',
      'workspace': 'Arbeitsraum',
      'blog-article': 'Blog-Artikel',
      'wiki-article': 'Wiki-Artikel',
      'chat-message': 'Chat',
      'create': 'Erstellen',
      'comment': 'Kommentieren',
      'share': 'Teilen',
      'subscribe': 'Abonnieren',
      'unsubscribe': 'Deabonnieren',
      'search': 'Suche',
      'timeline': 'Timeline',
      'filelibrary': 'Dokumente',
      'file-library': 'Dokumente',
      'content': 'Inhalt',
      'article': 'Artikel',
      // 'timeline': 'Verlauf',
      'list': 'Liste',
      'invited': 'Einladungen',
      'imprint': 'Impressum',
      // 'events': 'termine',
      'colleagues': 'Kollegen',
      'activity': 'Aktivitaeten',
      'quicksearch': 'Schnellsuche',
      'form': 'Formular',
      'task': 'Aufgaben',
      'files': 'Dateiübersicht',
      'settings': 'Einstellungen',
      'members': 'Mitglieder',
      'members-list': 'Mitglieder Liste',
      'members-invited': 'Mitglieder Einladungen',
      'members-requested': 'Mitglieder Anfragen',
      'participants': 'Teilnehmer',
      'create chatmessage': 'Nachricht senden',
      'create chatchannel': 'Chatkanal erstellen',
      'create timeline': 'Timeline Eintrag erstellen',
      'create article': 'Artikel erstellen',
      'create event': 'Event erstellen',
      'create page': 'Seite erstellen',
      'create workspace': 'Arbeitsraum erstellen',
      'view': 'Ansicht',
      'searchresults': 'Suchergebnis',
      'no-searchresults': 'Kein Suchergebnis',
      'widget-my-pages' : 'Widget-Meine-Seiten',
      'widget-my-workspaces' : 'Widget-Meine-Arbeitsraeume',
      'widget-bookmarks': 'Widget-Lesezeichen',
      'search-type': 'Suche-Typ',
      'search-modified': 'Suche-Geändert',
      'search-location': 'Suche-Ort',
      'search-author': 'Suche-Autor',
      'click': 'Klick',
      'media': 'Medien',
      'navi-top': 'Hauptnavigation',
      'navi-sub': 'Unternavigation',
      'navi-mobile': 'Mobilnavigation',
      'timeline-item': 'Timeline-Eintrag',
      'gone': 'Nicht im Büro',
      'away': 'Abwesend',
      'busy': 'Beschäftigt',
      'file': 'Datei',
      'user': 'Benutzer',
      'users': 'Benutzer',
      'list-entry': 'Listeneintrag',
      
      // 'blog-list-view': 'Blog',
      // 'wiki-list-view': 'Wiki'
  },
//   // this struct is used by coyoTrackingUtils.typeNameOverridesPageId and replaces keywords in the actionurl / pageid
  PAGEID: {
      'pages': 'seiten',
      'page': 'seite',
      'home': 'startseite',
      'workspaces': 'ar',
      'arbeitsraeume': 'ar',
      'workspace': 'ar',
      'search': 'suche'
  },
}

// you can override complete functionality like this:
// coyoTrackingUtils.translateText = function(text) { ... }