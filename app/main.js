define(function (require) {
    // use domReady! if you don't want your app loaded
    // until the browser has finished loading the page    
    // Load app-specific modules (like model) with a relative require 
    // Load library/vendor (like jquery) modules using full IDs
    require(['jquery', 'tf', './tokenizer', 'domReady!'], function ($, tf, tokenizer) {  

        // tfjs requires that models are loaded from a URL, so 
        // if you want to develop locally, the easiest way to 
        // load is to start a local server: 
        // python -m http.server 8000
        var modelURL = '//' + location.host + '/model/model.json';        
        
        tf.loadLayersModel(modelURL).then(function(model) {
            
            var sample = function(preds, temperature, callback) {
                tf.multinomial(preds.map(p=>Math.log(p)/temperature), 1)
                    .array().then(r=>callback(r[0]));
            }
    
            var get_next_word = function(done, sequence_length=0) {
                // create our input vector
                var period = tokenizer.text_to_sequence('.')[0];
                var input = tokenizer.text_to_sequence('.' + $('textarea').val());
                var buffer = new Array(25).fill(0).concat(input).slice(-25);
    
                // get the next word
                model.predict(tf.tensor2d([buffer])).array().then(function(preds){
                    sample(preds[0], $('#temperature').val(), function(seq) {
                        var word = tokenizer.sequence_to_text([seq]);

                        if (word == '.') { 
                            $('textarea').val($('textarea').val().trim() + '.');
                            done();
                        } else if (sequence_length >= 25) {
                            $('textarea').val($('textarea').val().trim() + ' ...');
                            done();
                        } else {
                            $('textarea').val($('textarea').val().trim() + ' ' + word);
                            get_next_word(done, sequence_length + 1);
                        }
                    }); 
                });
            }

            var running = false;

            $("textarea").keypress(function (e) {
                if (running) {
                    e.preventDefault();
                } else if (e.which == 13) {   
                    running = true; 

                    $("textarea")
                        .attr("readonly", true)
                        .addClass('text-success');
                    
                    // the setTimeout forces a new worker and allows 
                    // the above style changes to take place much faster
                    setTimeout(function() { 
                        get_next_word(function() {
                            running = false; 
                            $('textarea').attr("readonly", false).removeClass('text-success');
                        })
                    }, 0);

                    e.preventDefault();
                }
            });
        });
    });
});