using System.Web.Optimization;

namespace GameLocation.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery.js",
                        "~/Scripts/template.js",
                        "~/Scripts/site.js",
                        "~/Scripts/jquery.validate*",
                        "~/Scripts/jquery-ui.js",
                        "~/Scripts/jquery.ui.timepicker.js",
                        "~/Scripts/jquery.ui.datepicker-pt-BR.js",
                        "~/Scripts/jquery.ui.timepicker-pt-BR.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                       "~/Scripts/angular.js",
                       "~/Scripts/angular-route.js",
                       "~/Scripts/angular-cookies.js",
                       "~/Scripts/i18n/angular-locale_pt-br.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularapp")
                .IncludeDirectory("~/Scripts/app", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/template.less",
                      "~/Content/style.css"));

            bundles.Add(new StyleBundle("~/Content/csstemplateoff").Include(
          "~/Content/bootstrap.min.css",
          "~/Content/font-awesome.min.css",
          "~/Content/style.css"));

            bundles.Add(new ScriptBundle("~/bundles/login").Include(
            "~/Scripts/jquery.js",
            "~/Scripts/angular.js",
            "~/Scripts/angular-route.js",
            "~/Scripts/angular-locale_pt-br.js",
            "~/Scripts/angular.cookies.min.js",
            "~/Scripts/angular-sanitize.js",
            "~/Scripts/app/config.js",
            "~/Scripts/app/appconfig.js",
            "~/Scripts/app/routing.js",
            "~/Scripts/app/directives/loading.js",
            "~/Scripts/app/services/httpInterceptor.js",
            "~/Scripts/app/services/headerService.js",
            "~/Scripts/app/services/localStorageService.js",
            "~/Scripts/app/services/transformRequestAsFormPost.js",
            "~/Scripts/app/controller/LoginController.js",
            "~/Scripts/app/controller/SignUpController.js"));
        }
    }
}