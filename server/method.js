Meteor.methods({
    'recordInteraction': function(presId, reponse){
        check(presId, String);
        check(reponse, String);

        if (this.userId === null)
            return;

        var pres = modules.collections.Presentations.findOne({_id:presId});
        if (pres) {
            var session = modules.collections.Sessions.findOne({_id:pres.session});
            var block = {$set: {}};
            block.$set['interaction.'+session.currentStep+'.r.'+this.userId] = reponse;
            modules.collections.Sessions.update({_id:pres.session}, block);
        }
    }
});
