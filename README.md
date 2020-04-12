# Cyberspace Solarium Commission Bot

This repo is an example website for hosting that model. The language model is based on the [Cyberspace Solarium Commission's final report](https://www.solarium.gov). The code for training the model is [here](https://github.com/westpoint-neural-networks/lesson-30). To convert the model to javascript, simply install `tensorflow-js` and run the following code:

```python
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, "target_directory")
```

This project can be deployed for free to [Heroku](https://heroku.com) using a Ruby buildpack. The bot is currently hosted at [https://csc-bot.herokuapp.com/](https://csc-bot.herokuapp.com/). 