using System;
using Nancy;
using Nancy.Diagnostics;
using Nancy.Bootstrapper;

namespace ForgottenArts.Commerce.Server
{
	public class CustomBootstrapper : DefaultNancyBootstrapper
	{
		protected override DiagnosticsConfiguration DiagnosticsConfiguration
		{
			get { return new DiagnosticsConfiguration { Password = @"password"}; }
		}

		protected override void ApplicationStartup (Nancy.TinyIoc.TinyIoCContainer container, IPipelines pipelines)
		{
			StaticConfiguration.EnableRequestTracing = true;
			StaticConfiguration.DisableErrorTraces = false;
		}
	}
}

