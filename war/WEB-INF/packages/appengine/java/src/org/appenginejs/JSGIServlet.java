package org.appenginejs;

import javax.servlet.http.*;
import javax.servlet.*;

import java.io.*;
import java.util.TimeZone;

import org.mozilla.javascript.*;

@SuppressWarnings("serial")
public class JSGIServlet extends HttpServlet {
	private Scriptable scope;
	private Function app;
	private Function handler;
	
    public void init(ServletConfig config) throws ServletException {
    	super.init(config);

        // Set the timezone
        String tz = config.getInitParameter("timezone");
        if (tz != null) {
            TimeZone.setDefault(TimeZone.getTimeZone(tz));
        }

		String modulesPath = "";
		if(System.getProperty("os.name").indexOf("Windows")>=0){
			modulesPath = getServletContext().getRealPath(getInitParam(config, "modulesPath", "WEB-INF")).replaceAll("\\\\","\\\\\\\\");
		} else {
			modulesPath = getServletContext().getRealPath(getInitParam(config, "modulesPath", "WEB-INF"));
		}
		final String moduleName = getInitParam(config, "module", "src/jackconfig.js");
		final String appName = getInitParam(config, "app", "app");
    	
		final String narwhalHome = getServletContext().getRealPath("WEB-INF/packages/narwhal");
		final String narwhalEngineHome = getServletContext().getRealPath("WEB-INF/packages/narwhal/engines/rhino");
//		final String narwhalEngineHome = getServletContext().getRealPath("WEB-INF/packages/narwhal-appengine");
		final String narwhalFilename = "bootstrap.js";

		int optimizationLevel = Integer.parseInt(getInitParam(config, "optimizationLevel", "-1"));
        String environmentName = getInitParam(config, "environment", null);

		Context context = Context.enter();

		try {
            if (environmentName == null) {
                // if no explicit environmentName is provided, detect if we run on the
                // actual App Engine Server or the Development server and set the environment
                // accordingly.
                // http://blog.stringbuffer.com/2009/04/determining-if-your-code-is-executing.html
                if (getServletContext().getServerInfo().startsWith("Google App Engine/")) {
                    environmentName = "hosted";
                } else {
                    environmentName = "local";
                }
            }

            if (environmentName.equals("hosted")) {
                optimizationLevel = 9;
            }

			scope = new ImporterTopLevel(context);
			
		//	ScriptableObject.putProperty(scope, "NARWHAL_HOME",  Context.javaToJS(narwhalHome, scope));
			ScriptableObject.putProperty(scope, "NARWHAL_HOME",  Context.javaToJS(narwhalHome, scope));
			ScriptableObject.putProperty(scope, "NARWHAL_OPTIMIZATION",  Context.javaToJS(optimizationLevel, scope));
			ScriptableObject.putProperty(scope, "SERVLET_CONTEXT",  Context.javaToJS(getServletContext(), scope));

			context.setOptimizationLevel(optimizationLevel);			

			// load Narwhal
			context.evaluateReader(scope, new FileReader(narwhalEngineHome + "/" + narwhalFilename), narwhalFilename, 1, null);

			// load Servlet handler "process" method
			handler = (Function)context.evaluateString(scope, "require('jack/handler/servlet').Servlet.process;", null, 1, null);
			
			// load the app
			Scriptable module = (Scriptable)context.evaluateString(scope, "require('"+modulesPath+"/"+moduleName+"');", null, 1, null);
			
			app = (Function)module.get(appName, module);

			if (environmentName != null) {
				Object environment = module.get(environmentName, module);
				if (environment instanceof Function) {
					Object args[] = {app};
					app = (Function)((Function)environment).call(context, scope, module, args);
				} else {
					System.err.println("Warning: environment named \"" + environmentName + "\" not found or not a function.");
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			Context.exit();
		}
    }
    
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Context context = Context.enter();

		try	{
			Object args[] = {app, request, response};
			handler.call(context, scope, null, args);
		} finally {
			Context.exit();
		}
	}
	
	private String getInitParam(ServletConfig config, String name, String defaultValue) {
        String value = config.getInitParameter(name);
        return value == null ? defaultValue : value;
    }
}
