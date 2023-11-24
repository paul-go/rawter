
namespace Rawter.Cover
{
	/** */
	window.addEventListener("load", () =>
	{
		document.body.append(new RootHat().head);
		Rawter.go("/blue/any");
	});
	
	/** */
	class RootHat
	{
		readonly head;
		readonly target;
		readonly buttons;
		
		constructor()
		{
			this.head = raw.div(
				"root-hat",
				Rawter.onset("/", () => raw.get(this.buttons)(
					raw.button(
						raw.text("Goto Red Hat"),
						Rawter.on("/red", () =>
						{
							const hat = new RedHat();
							this.target.replaceChildren(hat.head);
						}),
					),
					raw.button(
						raw.text("Goto Blue Hat"),
						Rawter.on("/blue", () =>
						{
							const hat = new BlueHat();
							this.target.replaceChildren(hat.head);
						})
					),
				)),
				this.buttons = raw.div("roothat-buttons"),
				this.target = raw.div("roothat-target"),
			);
		}
	}
	
	/** */
	class RedHat
	{
		readonly head;
		readonly target;
		
		constructor()
		{
			this.head = raw.div(
				"red-hat",
				raw.text("Red Hat"),
				raw.button(
					raw.text("Goto Red Orange Hat"),
					Rawter.on("/red/orange", () =>
					{
						const hat = new OrangeHat();
						this.target.replaceChildren(hat.head);
					})
				),
				this.target = raw.div("target-redhat")
			);
		}
	}
	
	/** */
	class OrangeHat
	{
		readonly head;
		
		constructor()
		{
			this.head = raw.div(
				"orange-hat",
				raw.text("Red Orange Hat"),
			);
		}
	}
	
	/** */
	class BlueHat
	{
		readonly head;
		
		constructor()
		{
			this.head = raw.div(
				"blue-hat",
				raw.text("Blue Hat"),
				Rawter.on("/blue/?", route =>
				{
					if (route === "/blue/any")
					{
						const hat = new AnyHat();
						this.head.append(hat.head);
					}
				})
			);
		}
	}
	
	/** */
	class AnyHat
	{
		readonly head;
		
		constructor()
		{
			this.head = raw.div(
				"any-hat",
				raw.text("Any Hat"),
			);
		}
	}
	
	//@ts-ignore
	if (typeof module === "object") Object.assign(module.exports, { Cover });
}
