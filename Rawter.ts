
namespace Rawter
{
	/** */
	export function setup(rawReference?: Raw)
	{
		if (!rawReference)
		{
			if (typeof raw === "object")
				rawReference = raw;
			else
				throw new Error("global raw object not found.");
		}
		
		rawLocal = rawReference!;
		
		window.addEventListener("popstate", () =>
		{
			goInner(window.location.pathname);
		});
	}
	
	let rawLocal: Raw;
	
	/**
	 * 
	 */
	export function when(
		route: string,
		fn: WhenFn): Raw.Param
	{
		return whenInner(false, route, fn);
	}
	
	/**
	 * 
	 */
	export function whenPicked(
		pattern: string,
		fn: WhenFn): Raw.Param
	{
		return whenInner(true, pattern, fn);
	}
	
	/**
	 * 
	 */
	function whenInner(
		picked: boolean,
		pattern: string,
		whenFn: WhenFn): Raw.Param
	{
		if (!rawLocal)
			Rawter.setup(new Raw());
		
		if (!pattern.startsWith("/"))
			pattern = "/" + pattern;
		
		pattern = normalizeRoute(pattern);
		routePoints.push({ pattern, whenFn });
		
		if (picked)
		{
			return rawLocal.on("click", ev =>
			{
				ev.preventDefault();
				go(pattern);
			});
		}
	}
	
	/** */
	interface IRoutePoint
	{
		readonly pattern: string;
		readonly whenFn: WhenFn;
		handledRoute?: string;
	}
	
	const routePoints: IRoutePoint[] = [];
	
	/**
	 * 
	 */
	export function go(route: string)
	{
		history.pushState({}, "", route);
		goInner(route);
	}
	
	/** */
	async function goInner(route: string)
	{
		route = normalizeRoute(route);
		
		const routes = route
			.split("/")
			.map((_, i, a) => "/" + a.slice(0, i + 1).filter(s => s).join("/"));
		
		for (const currentRoute of routes)
		{
			for (const routePoint of routePoints)
			{
				if (routePoint.handledRoute === currentRoute)
					continue;
				
				if (!matchRoute(routePoint.pattern, currentRoute))
					continue;
				
				if (routePoint.whenFn(currentRoute) || !routePoint.pattern.split("/").includes(any))
					routePoint.handledRoute = currentRoute;
			}
		}
		
		// Clean out the handledRoute properties, now that we're on a different route.
		for (const rp of routePoints)
			if (rp.handledRoute)
				if (!routeStartsWith(rp.handledRoute, route))
					rp.handledRoute = undefined;
	}
	
	/**
	 * 
	 */
	function routeStartsWith(routePrefix: string, route: string)
	{
		const prefixParts = splitRoute(routePrefix);
		const routeParts = splitRoute(route);
		
		if (prefixParts.length > routeParts.length)
			return false;
		
		for (let i = -1; ++i < prefixParts.length;)
			if (prefixParts[i] !== routeParts[i])
				return false;
		
		return true;
	}
	
	/**
	 * Returns a boolean that indicatse whether the specified test route
	 * conforms to the specified pattern, taking into account wildcards (*). 
	 * This function can be used to determine if /some/route/* is a match
	 * for /some/route/123.
	 */
	function matchRoute(patternRoute: string, testRoute: string)
	{
		if (patternRoute === testRoute)
			return true;
		
		const patternParts = splitRoute(patternRoute);
		const testParts = splitRoute(testRoute);
		
		if (patternParts.length !== testParts.length)
			return false;
		
		for (let i = -1; ++i < patternParts.length;)
		{
			const patternPart = patternParts[i];
			const testPart = testParts[i];
			
			if (patternPart === any)
				continue;
			
			if (patternPart !== testPart)
				return false;
		}
		
		return true;
	}
	
	/** */
	function splitRoute(s: string)
	{
		return s.split("/").filter(s => s);
	}
	
	/**
	 * 
	 */
	function normalizeRoute(route: string)
	{
		return route.split("/").filter(s => s).map(s => "/" + s).join("");
	}
	
	const any = "?";
	
	/** */
	export type WhenFn = (route: string) => any;
	
	/** */
	export interface IHandlerParam
	{
		/**
		 * Contains a reference to any Event object, which will be available 
		 * in the case when the handler function 
		 */
		readonly event?: Event;
		
		/**
		 * Contains an array of decomposed string components of the path.
		 */
		readonly component: string;
		
		/**
		 * 
		 */
		readonly components: string[];
	}
}
