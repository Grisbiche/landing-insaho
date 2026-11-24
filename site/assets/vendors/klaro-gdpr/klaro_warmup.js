// put this as soon as possible in your page
if(!window.klaro_gtag_ready)
{
	window.klaro_gtag_ready = true;
	// Define dataLayer and the gtag function.
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	// Set default consent to 'denied' as a placeholder
	// Determine actual values based on your own requirements
	gtag("consent", "default", {
		ad_storage: "denied",
		analytics_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		personalization_storage: "denied",
		functionality_storage: "denied",
		security_storage: "granted",
		wait_for_update: 1000
	})
}
window.klaro_warmup_loaded = true