const app = new Vue({
	el: '#main-container',
	data: {
		resume: {}
	},
	computed: {
		included_icon_links() {
			return (this.resume.icon_links || []).filter(l => ['github', 'email', 'linkedin'].includes(l.name));
		}
	},
	methods: {
		jsonToUl(data) {
			var lines = []
			for(var i = 0; i < data.length; i++) {
				if ((i + 1) < data.length && typeof data[i + 1] !== "string"){
					lines.push(`<li>${data[i]}\n${this.jsonToUl(data[i + 1])}</li>`);
					i += 1;
				}
				else {
					lines.push(`<li>${data[i]}</li>`);
				}
			}
			return `<ul>\n${lines.join("\n")}\n</ul>`;
		},
		textToHTML(text) {
			text = text.replace(/\n/g, "<br>");
			return text;
		},
		expand_readmore(event) {
			// This could be done using vue.js but that would require each project and job to have reactive elements
			// console.log(element);
			event.target.parentNode.className += " expanded";
		}
	},
	created() {
		axios.get(`./resume/resume.json`)
			.then(response => {
				this.resume = response.data;
			})
			.catch(error => {
				console.log("error occured while retrieving resume data");
				console.log(error);
			});
	}
})