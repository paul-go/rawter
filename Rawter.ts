
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
	export function onset(
		route: string,
		fn: RawterFn): Raw.Param
	{
		return onInner(false, route, fn);
	}
	
	/**
	 * 
	 */
	export function on(
		pattern: string,
		fn: RawterFn): Raw.Param
	{
		return onInner(true, pattern, fn);
	}
	
	/**
	 * 
	 */
	function onInner(
		picked: boolean,
		pattern: string,
		whenFn: RawterFn): Raw.Param
	{
		if (!rawLocal)
			Rawter.setup(new Raw());
		
		if (!pattern.startsWith("/"))
			pattern = "/" + pattern;
		
		pattern = normalizeRoute(pattern);
		routePoints.push({ pattern, fn: whenFn });
		
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
		readonly fn: RawterFn;
		handledRoute?: string;
	}
	
	const routePoints: IRoutePoint[] = [];
	
	/**
	 * 
	 */
	export function go(route: string)
	{
		const path = normalizeRoute(window.location.pathname);
		const isBacktracking = routeStartsWith(route, path) && route.length < path.length;
		history.pushState({}, "", route);
		goInner(route, isBacktracking);
	}
	
	/** */
	async function goInner(route: string, isBacktracking = false)
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
				
				if (!matchRoute(routePoint.pattern, currentRoute, isBacktracking))
					continue;
				
				if (routePoint.fn(currentRoute) ||
					!routePoint.pattern.split("/").includes(any))
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
	function matchRoute(patternRoute: string, testRoute: string, isBacktracking: boolean)
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
	 * Normalizes the specified route so that it is in the
	 * form: /route/is/here
	 */
	function normalizeRoute(route: string)
	{
		return route.split("/").filter(s => s).map(s => "/" + s).join("");
	}
	
	const any = "?";
	
	/** */
	export type RawterFn = (route: string) => any;
}

//@ts-ignore CommonJS compatibility
if (typeof module === "object") Object.assign(module.exports, { Rawter});

// ES module compatibility
declare module "rawter"
{
	const __export: { Rawter: typeof Rawter };
	export = __export;
}

// The comment and + prefix is removed during npm run bundle
//+ export { Rawter }
