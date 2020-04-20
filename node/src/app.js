const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Benny Joseph'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Benny Joseph'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        title: 'This is help page',
        message: 'The site is still under development',
        name: 'Benny Joseph'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location } = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastdata) => {
            if(error) {
                return res.send({error})
            }
            res.send({
                location: location,
                forecast: forecastdata
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('error',{
        errcode: 404,
        message: "Help article not found",
        name: "Benny Joseph"
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        errcode: 404,
        message: 'This page does not exist on the server',
        name: "Benny Joseph"
    })
})

app.listen(port , () => {
    console.log('Server is up on port '+port)
})