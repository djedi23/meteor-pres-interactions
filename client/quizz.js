
modules.push('template.presentations.interaction.edit.quiz', 10, 'quizEdit');

Template.quiz.rendered = function() {
  Meteor.setTimeout(function(){
    $('.interaction').addClass('fade');
  }, 1);
};

Template.quiz.helpers({
  isSpeaker:function() {
    return Roles.userIsInRole(Meteor.user(), ['speaker']);
  },
  selected: function(){
    if (! Meteor.user())
      return null;

    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1}});
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var interaction = session?session.interaction:null;
      var step = interaction?interaction[session.currentStep]:null;
      return (step.r && step.r[Meteor.userId()]===this.k)?'checked':null;
    }
    return null;
  },
  disabled: function(){
    if (! Meteor.user())
      return true;

    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1}});
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var interaction = session?session.interaction:null;
      var step = interaction?interaction[session.currentStep]:null;
      return step.r?step.r[Meteor.userId()]:null;
    }
    return null;
  },
  count: function(){
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1}});
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var interaction = session?session.interaction:null;
      var step = interaction?interaction[session.currentStep]:null;
      return (step&&step.r)?_.size(step.r):0;
    }
    return null;
  },
  showResult: function(){
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne({_id:presId},{fields: {session: 1}});
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var interaction = session?session.interaction:null;
      var step = interaction?interaction[session.currentStep]:null;
      return (step&&step.status)?step.status==='results':null;
    }
    return null;
  },
  responseResult: function(){
    if (! Meteor.user())
      return null;

    var self = this;
    var presId = Session.get('currentPresentation');
    var pres = modules.collections.Presentations.findOne({_id:presId});
    if (pres){
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var interaction = session?session.interaction:null;
      var step = interaction?interaction[session.currentStep]:null;
      var results = step?step.r:null;
      var count = (step.r && step.r)?_.size(step.r):0;
      var counts = _.countBy(_.values(results||{}), _.identity);
      return _.map(self.responses, function(r) {
               return {l:r.l,
                 p: count===0?'---':numeral((counts[r.k]||0)/count).format('0%')
               };
             });
    }
    return null;
  }
});
Template.quiz.events({
  'click #valid': function(evt, tpl){
    evt.preventDefault();
    var reponse = tpl.$('input:checked').val();
    Meteor.call('recordInteraction', Session.get('currentPresentation'), reponse);
  },
  'click #reveal': function(evt, tpl){
    evt.preventDefault();
    var pres = modules.collections.Presentations.findOne({_id:Session.get('currentPresentation')});
    if (pres) {
      var session = modules.collections.Sessions.findOne({_id:pres.session});
      var block = {$set: {}};
      block.$set['interaction.'+session.currentStep+'.status'] = 'results';
      modules.collections.Sessions.update({_id:pres.session}, block);
    }
    
  }
});




Template.quizEdit.helpers({
  key: function(n){
    if (this.interaction && this.interaction.data && this.interaction.data.responses && this.interaction.data.responses[n])
      return this.interaction.data.responses[n].k;
    return null;
  },
  label: function(n){
    if (this.interaction && this.interaction.data && this.interaction.data.responses && this.interaction.data.responses[n])
      return this.interaction.data.responses[n].l;
    return null;
  },
  responses: function() {
    if (this.interaction && this.interaction.data){
      var rep = this.interaction.data.responses;
      rep.push({});
      return _.map(rep,function(e,i){
	       e.first = (i===0);
	       return e;
	     });
    }
    return [{first:true}];
  }
});


var formHandler = function(tpl, selector, form, field){
  var value = tpl.$(selector).val();
  value = value?value.trim():null;
  if (!_.isEmpty(value))
    form[field] = value;
  return form;
};

modules['template.presentations.interaction.edit.read.quiz'] = function(args){
  var form = args[0];
  var tpl = args[1];
  var data = {};
  var hasError = false;
  data = formHandler(tpl, '#quizzquestion', data, 'question');
  
  data.responses = [];
  tpl.$('.response-group').each(function(i){
    var key = $(this).find('.quizzresponsekey').val();
    var label = $(this).find('.quizzresponse').val();
    if (key && ! _.isEmpty(key.trim()) && label && ! _.isEmpty(label.trim())){
      if (_.some(_.map(data.responses, function(r){return r.k === key.trim();}))){ // Check duplicate keys
        $(this).addClass('has-error');
        hasError=true;
      }
      else
        $(this).removeClass('has-error');
      data.responses.push({k: key.trim(), l: label.trim()});
    }
  });
  return hasError?null:data;
};
