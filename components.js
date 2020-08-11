const fs = require('fs')

const components = []

fs.readdirSync('./components').forEach(file => {
	components.push(file)
})

let data = JSON.stringify(components)

fs.writeFileSync('./assets/js/components.json', data)