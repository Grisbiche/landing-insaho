var klaroApplyIeFix = true;
var klaroApps = [
    {
        name: "app_analytics",
        purposes: ['analytics'],
        title : {
            fr : "Mesure d'audience",
            nl : "Publieksmeting",
            en : "Analytics",
            de : "Publikumsmessung",
            es : "Medición de audiencias",
            it : "Misura del pubblico",
            pt : "Medição de audiências",
        },
        description : {
            fr : "Statistiques de visites",
            nl : "Bezoek statistieken",
            en : "Visits statistics",
            de : "Besucherstatistik",
            es : "Estadísticas de visitas",
            it : "Statistiche delle visite",
            pt : "Estatísticas de visitas",
        },
        cookies : [/^_?ga/i,/^_?gid/i],
        required : false,
        optOut : false,
    },
    {
        name: "app_marketing",
        purposes: ['marketing'],
        title : {
            fr : "Marketing",
            nl : "Marketing",
            en : "Marketing",
            en : "Marketing",
            es : "Marketing",
            it : "Marketing",
            pt : "Marketing",
        },
        description : {
            fr : "Destiné à l'affichage de messages ciblés",
            nl : "Voor gerichte weergave van berichten",
            en : "Designed for targeted message display",
            de : "Konzipiert für die gezielte Anzeige von Meldungen",
            es : "Destinado a la visualización de mensajes específicos",
            it : "Destinato alla visualizzazione mirata dei messaggi",
            pt : "Para exibir mensagens de destino",
        },
        cookies : [/^_?utm/i,/^hpm-/,/^vee24/],
        required : false,
        optOut : false,
    },
    {
        name: "app_preference",
        purposes: ['preference'],
        title : {
            fr : "Préférences utilisateur",
            nl : "Gebruikersvoorkeuren",
            en : "User preferences",
            de : "Benutzereinstellungen",
            es : "Preferencias del usuario",
            it : "Preferenze utente",
            pt : "Preferências do usuário",
        },
        description : {
            fr : "Destiné à l'amélioration de votre expérience de navigation. En dehors de votre navigation sur ce site, aucun usage ne sera fait des informations stockées.",
            nl : "Om uw browse-ervaring te verbeteren. Afgezien van uw navigatie op deze site, zal geen gebruik worden gemaakt van de opgeslagen informatie.",
            en : "Designed to enhance your navigation experience. Apart from your navigation on this site, no use will be made of the information stored.",
            de : "Entwickelt, um Ihr Navigationserlebnis zu verbessern. Abgesehen von Ihrer Navigation auf dieser Website werden die gespeicherten Informationen nicht verwendet.",
            es : "Diseñado para mejorar su experiencia de navegación. Aparte de su navegación en este sitio, no se hará ningún uso de la información almacenada.",
            it : "Progettato per migliorare l'esperienza di navigazione. A parte la navigazione in questo sito, non sarà fatto alcun uso delle informazioni memorizzate.",
            pt : "Concebido para melhorar a sua experiência de navegação. Para além da sua navegação neste site, as informações armazenadas não serão utilizadas.",
        },
        required : false,
        optOut : false,
    },
    {
        name: "app_basics",
        purposes: ['basics'],
        title : {
            fr : "Cookies strictement essentiels",
            nl : "Strikt noodzakelijke cookies",
            en : "Strictly essential cookies",
            de : "Zwingend notwendige Cookies",
            es : "Cookies estrictamente esenciales",
            it : "Cookies strettamente essenziali",
            pt : "Cookies estritamente necessários",
        },
        description : {
            fr : "Nécessaires au bon fonctionnement et à la sécurité de notre service. Ces cookies ne sont pas conservés au-delà de la durée de navigation sur notre service.",
            nl : "Noodzakelijk voor de goede werking en veiligheid van onze dienst. Deze cookies worden niet langer bewaard dan de duur van uw bezoek aan onze dienst.",
            en : "Necessary for the proper functioning of our service. These cookies are not stored beyond the duration of your browsing session.",
            de : "Die für das reibungslose Funktionieren unserer Dienste notwendig sind. Diese Cookies werden nicht über die Dauer Ihrer Browser-Sitzung hinaus gespeichert.",
            es : "Necesario para el buen funcionamiento y seguridad de nuestros servicios. Estas cookies no se almacenan más allá de la duración de la navegación en nuestros servicios.",
            it : "Necessario per il corretto funzionamento e la sicurezza dei nostri servizi. Questi cookie non vengono memorizzati oltre la durata della navigazione sui nostri servizi.",
            pt : "Necessário para o bom funcionamento e segurança do nosso serviço. Estes cookies não são armazenados para além da duração da sua visita ao nosso serviço.",
        },
        required : true,
        optOut : false,
    }
];

var klaro_lng = window.ENV_LNG ? window.ENV_LNG : document.querySelector('html').getAttribute('lang');
klaro_lng = klaro_lng ? klaro_lng : document.querySelector('body').getAttribute('lang');
var klaro_lng = ['fr','en','de','es','it','pt','nl'].indexOf(klaro_lng)>=0 ? klaro_lng : 'en';

// By default, Klaro will load the config from  a global "klaroConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="klaro.js" data-config="myConfigVariableName" />
// You can also disable auto-loading of the consent notice by adding
// data-no-auto-load=true to the script tag.
var klaroConfig = {

    theme: null, // [dark|lite] (dark by default)

    // You can customize the ID of the DIV element that Klaro will create
    // when starting up. If undefined, Klaro will use 'klaro'.
    elementID: 'klaro-manager',

    // You can customize the name of the cookie that Klaro uses for storing
    // user consent decisions. If undefined, Klaro will use 'klaro'.
    cookieName: 'klaro',

    // You can customize the name of the cookie that Klaro will use to
    // store user consent. If undefined, Klaro will use 'klaro'.

    // Put a link to your privacy policy here (relative or absolute).
    privacyPolicy: '#privacy',

    // Defines the default state for applications (true=enabled by default).
    default: false,

    // If "mustConsent" is set to true, Klaro will not allow the user to close
    // the modal before having actively consented.
    mustConsent: false,

    // You can define the UI language directly here. If undefined, Klaro will
    // use the value given in the global "lang" variable. If that does
    // not exist, it will use the value given in the "lang" attribute of your
    // HTML tag. If that also doesn't exist, it will use 'en'.
    lang: klaro_lng,

    // You can overwrite existing translations and add translations for your
    // app descriptions and purposes. See `src/translations.yml` for a full
    // list of translations that can be overwritten:
    // https://github.com/DPKit/klaro/blob/master/src/translations.yml

    // Example config that shows how to overwrite translations:
    // https://github.com/DPKit/klaro/blob/master/src/configs/i18n.js
    translations: {
        consentModal : {
            title : {
                fr : "RGPD - Utilisation des cookies",
                nl : "RGPD - Gebruik van cookies",
                en : "GDPR - Cookies usage",
                de : "DSGVO - Verwendung von Cookies",
                es : "RGPD - Uso de cookies",
                it : "RGPD - Utilizzo di cookie",
                pt : "RGPD - Utilização de cookies",
            },
            description : {
                fr : "Ce site utilise des Cookies et autres traceurs pour vous proposer une meilleure expérience de navigation, des messages ciblés et à des fins statistiques.",
                nl : "Deze site maakt gebruik van cookies en andere traceermiddelen om u een betere browse-ervaring, gerichte berichten en voor statistische doeleinden te bieden.",
                en : "This site uses cookies and other tracking devices to provide you with a better browsing experience, targeted messages and for statistical purposes.",
                de : "Diese Website verwendet Cookies und andere Tracking-Geräte, um Ihnen ein besseres Browsing-Erlebnis, gezielte Nachrichten und für statistische Zwecke zu ermöglichen.",
                es : "Este sitio utiliza cookies y otros dispositivos de seguimiento para proporcionarle una mejor experiencia de navegación, mensajes dirigidos y con fines estadísticos.",
                it : "Questo sito utilizza cookie e altri dispositivi di tracciamento per fornire una migliore esperienza di navigazione, messaggi mirati e per scopi statistici.",
                pt : "Este site utiliza cookies e outros dispositivos de rastreio para lhe proporcionar uma melhor experiência de navegação, mensagens direccionadas e para fins estatísticos.",
            },
            // Shown only when the site has a privacy policy URL (Hapi's patch of klaro.js).
            privacyPolicy : {
                text : {
                    fr : "Pour en savoir plus, consultez notre {privacyPolicy}.",
                    nl : "Voor meer informatie, gelieve onze {privacyPolicy} te lezen.",
                    en : "To learn more, please read our {privacyPolicy}.",
                    de : "Bitte lesen Sie unsere {privacyPolicy}, um weitere Details zu erfahren.",
                    es : "Para más información, por favor lea nuestra {privacyPolicy}.",
                    it : "Per saperne di più, leggi la nostra {privacyPolicy}.",
                    pt : "Para saber mais, leia a nossa {privacyPolicy}.",
                },
            },
        },

        consentNotice : {
            changeDescription : {
                fr : "Des modifications ont eu lieu depuis votre dernière visite, merci de mettre à jour votre consentement.",
                nl : "Er zijn veranderingen opgetreden sinds uw laatste bezoek, gelieve uw toestemming bij te werken.",
                en : "There were changes since your last visit, please update your consent.",
                de : "Es gab Änderungen seit Ihrem letzten Besuch, bitte aktualisieren Sie Ihre Auswahl.",
                es : "Los cambios han ocurrido desde su última visita, por favor actualice su consentimiento.",
                it : "Sono intervenuti cambiamenti dall'ultima visita, per favore aggiorna il tuo consenso.",
                pt : "Mudanças ocorreram desde sua última visita, por favor, atualize seu consentimento.",
            },
            description : {
                fr : "Avec votre accord, nous et nos partenaires utilisons des cookies et des identifiants publicitaires pour mesurer l’audience du site et à des fins publicitaires. Ils servent à la publicité personnalisée comme non personnalisée, et vos données personnelles peuvent être utilisées pour personnaliser les publicités. Vous pouvez modifier vos choix à tout moment.",
                nl : "Met uw toestemming gebruiken wij en onze partners cookies en advertentie-ID’s om het bezoek aan de site te meten en voor advertentiedoeleinden. Ze worden gebruikt voor zowel gepersonaliseerde als niet-gepersonaliseerde advertenties, en uw persoonsgegevens kunnen worden gebruikt om advertenties te personaliseren. U kunt uw keuzes op elk moment wijzigen.",
                en : "With your consent, we and our partners use cookies and advertising identifiers to measure the site’s audience and for advertising purposes. They are used for both personalised and non-personalised advertising, and your personal data may be used to personalise ads. You can change your choices at any time.",
                de : "Mit Ihrer Einwilligung verwenden wir und unsere Partner Cookies und Werbe-IDs, um die Reichweite der Website zu messen und zu Werbezwecken. Sie dienen sowohl personalisierter als auch nicht personalisierter Werbung, und Ihre personenbezogenen Daten können zur Personalisierung von Anzeigen verwendet werden. Sie können Ihre Auswahl jederzeit ändern.",
                es : "Con su consentimiento, nosotros y nuestros socios utilizamos cookies e identificadores publicitarios para medir la audiencia del sitio y con fines publicitarios. Sirven tanto para la publicidad personalizada como para la no personalizada, y sus datos personales pueden utilizarse para personalizar los anuncios. Puede modificar sus preferencias en cualquier momento.",
                it : "Con il suo consenso, noi e i nostri partner utilizziamo cookie e identificatori pubblicitari per misurare l’audience del sito e per finalità pubblicitarie. Servono sia alla pubblicità personalizzata sia a quella non personalizzata, e i suoi dati personali possono essere utilizzati per personalizzare gli annunci. Può modificare le sue scelte in qualsiasi momento.",
                pt : "Com o seu consentimento, nós e os nossos parceiros utilizamos cookies e identificadores publicitários para medir a audiência do site e para fins publicitários. Servem tanto para a publicidade personalizada como para a não personalizada, e os seus dados pessoais podem ser utilizados para personalizar os anúncios. Pode alterar as suas escolhas a qualquer momento.",
            },
            // Appended to the description, only when the site has a privacy policy URL (Hapi's patch of klaro.js).
            privacyPolicy : {
                fr : "Pour en savoir plus, consultez notre {privacyPolicy}.",
                nl : "Voor meer informatie, gelieve onze {privacyPolicy} te lezen.",
                en : "To learn more, please read our {privacyPolicy}.",
                de : "Bitte lesen Sie unsere {privacyPolicy}, um weitere Details zu erfahren.",
                es : "Para más información, por favor lea nuestra {privacyPolicy}.",
                it : "Per saperne di più, leggi la nostra {privacyPolicy}.",
                pt : "Para saber mais, leia a nossa {privacyPolicy}.",
            },
            learnMore : {
                fr : "Paramétrer les préférences",
                nl : "Voorkeuren instellen",
                en : "Set preferences",
                de : "Einstellungen anpassen",
                es : "Configurar preferencias",
                it : "Impostare le preferenze",
                pt : "Configurar preferências",
            },
        },

        // The purposes will be displayed in the consent notice, make sure
        // to add translations for each purposes you give in the 'apps' section.
        purposes: {
            basics : {
                fr : "Technique / Sécurité",
                nl : "Technisch / Veiligheid",
                en : "Technical / Security",
                de : "Technik / Sicherheit",
                es : "Técnica / Seguridad",
                it : "Tecnico / Sicurezza",
                pt : "Tecnologia / Segurança",
            },
            analytics : {
                fr : "Analytics",
                nl : "Analytics",
                en : "Analytics",
                de : "Analytics",
                es : "Analytics",
                it : "Analytics",
                pt : "Análises",
            },
            preference : {
                fr : "Préférences",
                nl : "Voorkeuren",
                en : "Preferences",
                de : "Präferenzen",
                es : "Preferencias",
                it : "Preferenze",
                pt : "Preferências",
            },
            marketing : {
                fr : "Marketing",
                nl : "Marketing",
                en : "Marketing",
                de : "Marketing",
                es : "Marketing",
                it : "Marketing",
                pt : "Marketing",
            },
        },
    },

    // This is a list of third-party apps that Klaro will manage for you.
    apps : [],
}

function klaroApps_getText(dico)
{
    if(dico[klaro_lng])
        return dico[klaro_lng];
    else if(dico['en'])
        return dico['en'];
    else if(dico['fr'])
        return dico['fr'];
    return '';
};

function klaroApps_init(){
    for(var i=0; i<klaroApps.length; i++)
    {
        var app = klaroApps[i];
        klaroConfig.translations[app.name] = { description: { } };
        klaroConfig.translations[app.name].description[klaro_lng] = klaroApps_getText(app.description);

        klaroConfig.apps.push({
            name : app.name,
            title : klaroApps_getText(app.title),
            purposes : app.purposes,
            required: app.required,
            optOut: app.optOut
        });
    };
}
klaroApps_init();