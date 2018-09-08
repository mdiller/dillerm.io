// Hey there. This is a bit of javascript that loads my resume information from a json file, and inserts it into my website
// 
// While there are more complicated and perhaps more elegant ways of filling in an html template with json,
// I figured that this would be a nice, simple, easy to read format. 




function textToHTML(text) {
	text = text.replace(/\n/g, "<br>");
	return text;
}

function jsonToUl(data) {
	var lines = []
	for(var i = 0; i < data.length; i++) {
		if ((i + 1) < data.length && typeof data[i + 1] !== "string"){
			lines.push(`<li>${data[i]}\n${jsonToUl(data[i + 1])}</li>`);
			i += 1;
		}
		else {
			lines.push(`<li>${data[i]}</li>`);
		}
	}
	return `<ul>\n${lines.join("\n")}\n</ul>`;
}


function expand_readmore(element) {
	element.parentNode.className += " expanded";
}

function readMoreSection(data) {
	return !data.description ? "" : `
		<section class="read-more">
			<span onclick="expand_readmore(this)">Read More &#9658</span>
			<p>${data.description}</p>
		</section>
	`;
}

function jobToHTML(job) {
	return `
		<section>
			<h3>
				${job.company}
			</h3>
			<div class="location-date">
				${job.location} (${job.date_start} - ${job.date_end})
			</div>
			${jsonToUl(job.bullets)}
			${readMoreSection(job)}
		</section>`;
}

function projectToHTML(project) {
	var title = project.link ? `<a href="${project.link}">${project.title}</a>` : project.title;
	return `
		<section>
			<h3>
				${title}
				<span class="github-link">
					<a href=${project.github}>
						View Source
					</a>
				</span>
			</h3>
			${jsonToUl(project.bullets)}
			${readMoreSection(project)}
		</section>`;
}

function iconLinkToHTML(icon_link) {
	var text = icon_link.link ? `<a href="${icon_link.link}">${icon_link.text}</a>` : textToHTML(icon_link.text);
	return `
		<tr>
			<td>
				<img class="icon" src="resume/images/${icon_link.icon}">
			</td>
			<td>
				${text}
			</td>
		</tr>`;
}


// Just inserting these as strings because it isn't worth loading js-dom
function addExperience(jobs, config) {
	jobs.forEach(job => {
		$("#experience").append(jobToHTML(job))
	});
}

function addProjects(projects, config) {
	projects.forEach(project => {
		$("#projects").append(projectToHTML(project));
	});
}

function addIconLinks(icon_links) {
	icon_links.filter(link => ["github", "email", "linkedin"].indexOf(link.name) > -1).forEach(icon_link => {
		$("section#icon-links table").append(iconLinkToHTML(icon_link));
	});
}

function addLanguages(languages) {
	var lang_text = `
		<section>
			<h3>Proficient</h3>
			${jsonToUl(languages.proficient)}
		</section>
		<section>
			<h3>Familiar</h3>
			${jsonToUl(languages.familiar)}
		</section>`;
	$("section#languages").append(lang_text);
}

function addEducation(education) {
	var education_text = `
		<section>
			<h4>${education.title}</h4>
			<p>${textToHTML(education.text)}</p>
		</section>`;
	$("section#education").append(education_text);
}

function addAboutMe(about_me) {
	$("section#about-me").append(`<p>${about_me}</p>`);
}


function processResume(resume_json) {
	// addExperience(resume_json.experience);
	addProjects(resume_json.projects);
	addIconLinks(resume_json.icon_links);
	addLanguages(resume_json.languages);
	addEducation(resume_json.education);
	addAboutMe(resume_json.about_me);
}


const app = new Vue({
	el: '#main-container',
	data: {
		resume: {}
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
		}
	},
	created() {
		axios.get(`./resume/resume.json`)
			.then(response => {
				this.resume = response.data;
				processResume(this.resume);
			})
			.catch(error => {
				console.log("error occured while retrieving resume data");
				console.log(error);
			});
	}
})