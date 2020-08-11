const clearContent = () => {

	let confirm = window.confirm('¿Desea borrar el contenido?')

	if (confirm) {
		let element = document.querySelector('#mainContent')
			element.innerHTML = ''
	}
	
}

const deleteComponent = (element) => {
	element.parentNode.remove()
}

const download = () => {

	let	htmlContent = document.querySelector('#mainContent').innerHTML,
		htmlContentProcessed = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + htmlContent.replace(/<div class="component">[^!]*!-- COMPONENT START -->|<!-- COMPONENT END --><\/div>/gmi, '') + '</body></html>'
		blob = new Blob([htmlContentProcessed], {type: 'text/HTML'}),
		hiddenLink = document.createElement('a')
	
	hiddenLink.download = 'BODY.html'
	hiddenLink.href = window.URL.createObjectURL(blob)
	hiddenLink.dataset.downloadurl = ['text/HTML', hiddenLink.download, hiddenLink.href].join(':')
	hiddenLink.hidden = true

	document.querySelector('body').appendChild(hiddenLink)

	hiddenLink.click()

	hiddenLink.remove()

}

const importComponent = (component) => {

	fetch(`./components/${component}`)

		.then(response => response.text())

		.then(componentContent => {

			let element = document.createElement('div')
				element.classList.add('component')
				componentContent = componentContent.replace(/([\s\S]*<body[^\>]*>)([\s\S]*)(<\/body>[\s\S]*)/gmi, '$2')
				element.innerHTML = `<div class="component__toolkit"><button onclick="deleteComponent(this.parentNode)" class="btn btn--primary btn--toolkit btn--toolkit-remove"></button><button onclick="moveComponentUp(this.parentNode.parentNode)" class="btn btn--secondary btn--toolkit btn--toolkit-up"></button><button onclick="moveComponentDown(this.parentNode.parentNode)" class="btn btn--secondary btn--toolkit btn--toolkit-down"></button></div><!-- COMPONENT START -->${componentContent}<!-- COMPONENT END -->`

			document.querySelector('#mainContent').appendChild(element)

		})

}

const moveComponentDown = (component) => {
	
	let	newNode = component,
		referenceNode = component.nextSibling

	component.parentNode.insertBefore(newNode, referenceNode.nextSibling)

}

const moveComponentUp = (component) => {
	
	let	newNode = component,
		referenceNode = component.previousSibling

	component.parentNode.insertBefore(newNode, referenceNode)

}

const insertAfter = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const populateNav = (components) => {

	components.forEach(component => {

		let element = document.createElement('li')
			element.innerHTML = `<a href="javascript:importComponent('${component}')" class="nav__link">${component.split('.').shift()}</a>`

		document.querySelector('#nav > ul').appendChild(element)

	})

}

fetch('./assets/js/components.json')
	.then(response => response.json())
	.then(data => populateNav(data))