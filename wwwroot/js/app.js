//***************************************************LAUNCHES APPLICATION AND CREATES EVENTS**************************************

var ACTIVE_QUESTION;
var AJAX_LOADER_TIMEOUT;

var APP = (function (data_api, render) {

    function init() {
        data_api.getMeetings()
            .then(data => {
                $('.meeting-loader').hide();
                $('.meeting-choice').show();
                //var html = '<option>Pick a meeting</option>';
                var html = '';
                data.forEach(d => {
                    html += '<option  data-meetingid="' + d.meetingID +
                        '" class="dropdown-item meeting-select" value="' + d.meetingID + '">' +
                        moment(d.meetingDate).format("DD/MM/YY") + '</option>';
                });
                $('#meetingChoices').append(html);
            });

        registerEvents();
    }

    //click events and flow
    function registerEvents() {

        //get patients for meeting
        $('body').on('change', '#meetingChoices', (e) => {
            let meetingDate = $('#meetingChoices option:selected').html();
            if (!$('#meetingChoices').val()) {
                $('.control-panel').hide();
            } else {
                $('.control-panel').show();

                data_api.getPatients($('#meetingChoices').val())
                    .then(patients => {
                        let meetingID = render.patients(patients, meetingDate);
                        data_api.getActiveQuestion(meetingID)
                            .then(data => {
                                ACTIVE_QUESTION = data;
                                $("body").find("button[data-meeting-patient-id='" + data.meetingPatientID + "']").trigger('click');
                            })
                            .catch(err => {
                                ACTIVE_QUESTION = null;
                            });
                    });
            }
        });

        //select a patient
        $('body').on('click', '.pick-patient', (e) => {
            $('.patient-details').hide();
            $('.question-result').hide();
            $('.pick-patient').removeClass('selected-patient ');
            $(e.currentTarget).addClass('selected-patient');
            var patientID = $(e.currentTarget).data('patient-id');

            data_api.getPatientDetails(patientID)
                .then(patient => { return render.patientDetails(patient); })
                .then(patient => data_api.getQuestionsForPatient(patient.meetingPatientID))
                .then(questions => render.questions(questions));
        });

        //open vote
        $('body').on('click', '.open-vote', (e) => {
            var meetingPatientQuestionID = $(e.currentTarget).data('meeting-patient-question-id');
            data_api.openVoteForQuestion(meetingPatientQuestionID)
                .then(render.questionOpen(meetingPatientQuestionID));
        });

        //select a question
        $('body').on('click', '.question-row', (e) => {
            AJAX_LOADER_TIMEOUT = setTimeout(function () {
                $('#score').html('<h2>Loading...</h2>');
            }, 2000);          
            $('.question-result').show();
            let id = $(e.currentTarget).data('meeting-patient-question-id');
            $('.question-row').removeClass('selected-patient');
            $('.selected-arrow').remove();
            $(e.currentTarget).addClass('selected-patient');
            $(e.currentTarget).append('<img style="width:30px;float:right" src="/open-iconic/svg/arrow-thick-right.svg" class="selected-arrow">');
            data_api.getQuestion(id)
                .then(data => {
                    render.questionResult(data);
                });
        });

        //complete the vote
        $('body').on('click', '.complete-vote', (e) => {
            let id = $(e.currentTarget).data('meeting-patient-question-id');
            data_api.completeVoteForQuestion(id)
                .then(() => data_api.getResults(id))
                .then((results) => {
                    render.chart(results.chartData);
                    $('#score').html('Average score: ' + results.averageScore.toFixed(1));
                    $('.question-row, .pick-patient').removeClass('question-disabled');
                    $('.question-row, .pick-patient').prop('disabled', false);
                    $('.new-question').prop('disabled', false);
                   // data_api.getQuestionsForPatient(meetingPatientID);
                });
        });

        //add new question
        $('body').on('click', '.new-question', e => {
            $('#addNewDialog').modal();
            $('#newQuestionText').focus();
         
            $('#submitNewQuesion').click((e) => {
                const meetingPatientID = $('.selected-patient').data('meeting-patient-id');
                const questionText = $('#newQuestionText').val();
                data_api.addNewQuestion(meetingPatientID, questionText)
                    .then(newQuestion => data_api.getQuestionsForPatient(meetingPatientID))
                    .then((questions) => render.questions(questions));
                $('#addNewDialog').modal('hide');
            });
    });

      

        //test only - reset all the questions
        $('body').on('click', '.open-all', (e) => {
            let id = $(e.currentTarget).data('meeting-id');
            $.post('https://api.epivote.uk/vote/ResetMeeting/' + id)
                .then(() => data_api.getQuestionsForPatient(id));
        });

     
    }



    return {
        init: init
    };


})(DATA_API, RENDER);