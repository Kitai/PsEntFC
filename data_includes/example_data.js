//var shuffleSequence = seq("intro", rshuffle(endsWith("Critical"),endsWith("ControlFalse"),endsWith("ControlTrue"),
//                                            endsWith("FillerTrueFal"),endsWith("FillerFalseTru")));
var shuffleSequence = seq("Instructions", "Practice", "AfterPractice", 
                          rshuffle("PsEnt"), "PsCheck",
                          "PostExp"); 
var practiceItemTypes = ["Practice"];

var showProgressBar = false;

var defaults = [
    "DynamicQuestion",
    {
        clickableAnswers: false,
        enabled: false
    }
];

var host = "http://files.lab.florianschwarz.net/ibexfiles/Pictures/",
    audioHost = "http://files.lab.florianschwarz.net/ibexfiles/PsEntEx1ReGBAl/Audio/";

var items = [

    ["Instructions", "__SetCounter__", { }],
    
    ["Instructions", "Form", {html: {include: "ProlificConsentForm.html"}, continueOnReturn: true}],

    ["Instructions", "Message", {html: {include: "warning.html"}}],
    
    ["Instructions", "Message", {html: {include: "instructions.html"}}],
    
    ["AfterPractice", "Message", {html: "Very well, now let's proceed to the actual experiment."}],

    ["PostExp", "Form", {
        html: {include: "ProlificFeedbackPreConfirmation.html"}
    }],
    
    ["PostExp", "__SendResults__", {
       manualSendResults: true,
       sendingResultsMessage: "Please wait while your answers are being saved.",
       completionMessage: "Your answers have successfully being saved!"
    }],
    
    ["PostExp", "Message", {
        transfer: null,
        html: {include: "ProlificConfirmation.html"}
    }]

   ].concat(GetItemsFrom(data, null, {
       ItemGroup: ["item", "group"],
       Elements: [
           function(x){return x.Expt;},          // Name of the item: 'Condition' column
           "Preloader",
           {files: function(x){return ["CoveredBox.png", "calendar3.png",
                     x.target_filename, x.target_M, x.target_T, x.target_W,
                     x.competitor_filename, x.competitor_M, x.competitor_T, x.competitor_W,
                     x.firstFiller_filename, x.firstFiller_M, x.firstFiller_T, x.firstFiller_W,
                     x.secondFiller_filename, x.secondFiller_M, x.secondFiller_T, x.secondFiller_W];},
            host: host
           },    
           "DynamicQuestion",
           {
               legend: function(x){ return [x.Condition,x.item,x.group,x.Test_Sentence].join("+"); },
               context: function(x){ return x.Context_Sentence; },
               test: function(x){ return x.Test_Sentence; },
               answers: function(x){ 
                   var target = {person:x.target_filename, monday: x.target_M, tuesday: x.target_T, wednesday: x.target_W},
                       competitor = {person:x.competitor_filename, monday: x.competitor_M, tuesday: x.competitor_T, wednesday: x.competitor_W},
                       firstFiller = {person:x.firstFiller_filename, monday: x.firstFiller_M, tuesday: x.firstFiller_T, wednesday: x.firstFiller_W},
                       secondFiller = {person:x.secondFiller_filename, monday: x.secondFiller_M, tuesday: x.secondFiller_T, wednesday: x.secondFiller_W},
                       target_covered = {person:x.target_filename, monday: "CoveredBox.png", tuesday: "CoveredBox.png", wednesday: "CoveredBox.png"},
                       competitor_covered = {person:x.competitor_filename, monday: "CoveredBox.png", tuesday: "CoveredBox.png", wednesday: "CoveredBox.png"},
                       firstFiller_covered = {person:x.firstFiller_filename, monday: "CoveredBox.png", tuesday: "CoveredBox.png", wednesday: "CoveredBox.png"},
                       secondFiller_covered = {person:x.secondFiller_filename, monday: "CoveredBox.png", tuesday: "CoveredBox.png", wednesday: "CoveredBox.png"},
                       visible, covered;
                   
                   switch (x.TargetPosition) {
                           case "top":
                               visible = [target, competitor, firstFiller, secondFiller];
                               covered = [target_covered, competitor_covered, firstFiller_covered, secondFiller_covered];
                               break;
                           case "bottom":
                               visible = [firstFiller, secondFiller, target, competitor];
                               covered = [firstFiller_covered, secondFiller_covered, target_covered, competitor_covered];
                   }
                   
                   return { Visible: ["F", newCalendar(visible, 3, "visible", true)], Covered: ["J", newCalendar(covered, 3, "covered", true)] };
               },
               sequence: function(x){ return [
                   // DEBUG INFORMATION
                   // "Condition: "+x.Condition+"; Item: "+x.item+"; Group: "+x.group,
                   {pause: 150},
                   //x.Context_Sentence,
                   {this: "answers", showKeys: "top"},
                   {this: "context"},
                   {pause: 150, newRT: true},
                   //x.Test_Sentence,
                   {this: "test"},
                   function(t){ 
                      $("#visiblehideWednesday, #coveredhideWednesday").css("display", "none");
                      t.enabled=true;
                   }
               ];}
           }
       ]
   }));
