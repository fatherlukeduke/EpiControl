//***************************************************LAUNCHES APPLICATION AND CREATES EVENTS**************************************

var ACTIVE_QUESTION;   //global to track if there is an active question
var CURRENT_MEETING;   //global to track current meeting
var AJAX_LOADER_TIMEOUT;  //global to track timeout timers
//var URLS;  //resolved URLs

var APP = (function (_data_api, _render, _config) {

    //display error message
    //---------------------------------------------------------------------------
    function showError(message) {
        $('#system-error').html('<h3>' + message + '</h3>');
        $('#system-error').show('slow');
        setTimeout(function () { $('#system-error').hide('slow'); }, 7000);
    }

    //initialise this bad boy.  Authenticate, then fetch future meetings
    //---------------------------------------------------------------------------
    function init() {
        return new Promise(resolve => {
           // URLS = urls;

            _data_api.AuthenticateWithAPI()
                .then(() => {
                    return _data_api.getMeetings();
                })
                .then(data => {
                    $('.meeting-loader').hide();
                    $('.meeting-choice').show();
                    var html = '';
                    data.forEach(d => {
                        html += '<option data-meeting-status="' + d.meetingOpen + '" data-meeting-code="' + d.meetingCode +
                            '" class="dropdown-item meeting-select" value="' + d.meetingID + '">' +
                            moment(d.meetingDate).format("DD/MM/YY  hh:mm") + '</option>';
                    });
                    $('#meetingChoices').append(html);
                })
                .catch(xhr => {
                    showError('There was a problem processing the server request');
                    console.log(xhr);
                });

            registerEvents();

        });

    }

    //click events and flow
    function registerEvents() {

        //get meeting details and patients for selected
        //------------------------------------------------------------------
        $('body').on('change', '#meetingChoices', e => {
            let meetingDate = $('#meetingChoices option:selected').html();
            $('.question-panel').hide();

            if (!$('#meetingChoices').val()) {
                $('.control-panel').hide();
                CURRENT_MEETING = null;
            } else {
                _data_api.getMeeting($('#meetingChoices').val())
                    .then(meeting => {
                        CURRENT_MEETING = meeting;
                        _render.meetingDetails(meeting);
                    })
                    .catch(err => console.log('Error: ' + JSON.stringify(err)));

                _data_api.getPatients($('#meetingChoices').val())
                    .then(patients => {
                        $('#patients').html('<h2>Loading.....</h2>');
                        let meetingID = _render.patients(patients, meetingDate);
                        _data_api.getActiveQuestion(meetingID)
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

        //add new patient
        //------------------------------------------------------------------
        $('body').on('click', '#addNewPatient', e => {
            $('#newPatientForm input').val('');
            $('#addNewPatientDialog').modal();
            $('#newHospitalNumber').focus();
            $('#addPatientError').hide();
            $('#newDOB').datetimepicker({
                format: 'd/m/Y', timepicker: false,
                mask: true
            });
        });

        $('body').on('click', '#submitNewPatient', e => {
            let validated = true;

            //validate
            $('#newPatientForm input').each((index, element) => {
                if ($(element).val().length === 0) {
                    validated = false;
                }
            });

            if (validated) {
                _data_api.addNewPatient(
                    $('#newHospitalNumber').val(),
                    $('#newFirstname').val(),
                    $('#newSurname').val(),
                    $('#newDOB').val(),
                    $('#meetingChoices').val()
                ).then(patient => _data_api.getPatients($('#meetingChoices').val()))
                    .then(patients => _render.patients(patients));
                $('#addNewPatientDialog').modal('hide');
            } else {
                $('#addPatientError').html('You need to fill all the fields in.').show();
            }
        });

        //select a patient
        //------------------------------------------------------------------
        $('body').on('click', '.pick-patient', e => {
            $('.patient-details div').css('opacity', 0);
            $('.question-panel').show();
            $('.question-result').hide();
            $('.pick-patient').removeClass('selected-patient ');
            $(e.currentTarget).addClass('selected-patient');
            var patientID = $(e.currentTarget).data('patient-id');
            var meetingPatientID = $(e.currentTarget).data('meeting-patient-id');

            _data_api.getPatientDetails(patientID)
                .then(patient => { return _render.patientDetails(patient); })
                .then(patient => {
                    AJAX_LOADER_TIMEOUT = setTimeout(function () {
                        $('#questions').html('<h2>Loading...</h2>');
                    }, 1000);
                    return _data_api.getQuestionsForPatient(patient.meetingPatientID);
                })
                .then(questions => _render.questions(questions, meetingPatientID))
                .catch(err => console.log('Error: ' + JSON.stringify(err)));
        });

        //open vote
        //------------------------------------------------------------------
        $('body').on('click', '.open-vote', e => {
            var meetingPatientQuestionID = $(e.currentTarget).data('meeting-patient-question-id');
            _data_api.openVoteForQuestion(meetingPatientQuestionID)
                .then(question => {
                    ACTIVE_QUESTION = question;
                    _render.questionOpen(meetingPatientQuestionID);
                })
                .catch(err => console.log('Error: ' + JSON.stringify(err)));
        });

        //select a question
        //------------------------------------------------------------------
        $('body').on('click', '.question-row', e => {
            AJAX_LOADER_TIMEOUT = setTimeout(function () {
                $('#score').html('<h2>Loading...</h2>');
            }, 1000);
            $('#results').hide();
            $('.question-result').show();
            let id = $(e.currentTarget).data('meeting-patient-question-id');
            $('.question-row').removeClass('selected-patient');
            $('.selected-arrow').remove();
            $(e.currentTarget).addClass('selected-patient');
            $(e.currentTarget).append('<img style="width:30px;float:right" src="' + _config.urls.base + '/images/arrow-thick-right.svg" class="selected-arrow">');
            _data_api.getQuestion(id)
                .then(data => {
                    _render.questionResult(data);
                });
        });

        //complete the vote
        //------------------------------------------------------------------
        $('body').on('click', '.complete-vote', e => {
            let id = $(e.currentTarget).data('meeting-patient-question-id');
            _data_api.completeVoteForQuestion(id)
                .then(() => _data_api.getResults(id))
                .then((results) => {
                    $('#results').show();
                    _render.chart(results.chartData);
                    $('#score').html('<h2>Average score: ' + results.averageScore.toFixed(1) + '</h2>');
                    $('.question-row, .pick-patient').removeClass('element-disabled');
                    $('.change-status').removeClass('meeting-status-disabled');
                    $('.question-row, .pick-patient, .change-status').prop('disabled', false);
                    $('.new-question').prop('disabled', false);
                    $('#addNewPatient').prop('disabled', false);
                })
                .catch(err => console.log('Error: ' + JSON.stringify(err)));
        });


        //add new question
        //------------------------------------------------------------------
        $('body').on('click', '#submitNewQuestion', e => {
            const meetingPatientID = $('.selected-patient').data('meeting-patient-id');
            const questionText = $('#newQuestionText').val();
            _data_api.addNewQuestion(meetingPatientID, questionText)
                .then(newQuestion => _data_api.getQuestionsForPatient(meetingPatientID))
                .then((questions) => _render.questions(questions))
                .catch(err => console.log('Error: ' + JSON.stringify(err)));
            $('#addNewQuestionDialog').modal('hide');
        });

        $('body').on('click', '.new-question', e => {
            $('#addNewQuestionDialog').modal();
            $('#newQuestionText').focus();
            $('#newQuestionText').val('');
        });

        //change meeting status
        //------------------------------------------------------------------
        $('body').on('click', '.change-status', e => {
            if ($(e.currentTarget).html() === 'Open') {
                $('#meetingStatusTitle').html('<h4>Close this meeting?</h4>');
                $('.open-meeting').hide();
                $('.close-meeting').show();
            } else {
                $('#meetingStatusTitle').html('<h4>Open this meeting?</h4>');
                $('.close-meeting').hide();
                $('.open-meeting').show();
            }
            $('#changeMeetingStatusDialog').modal();
        });

        $('body').on('click', '.open-meeting', e => {
            let meetingID = $('#meetingChoices').val();
            $('#changeMeetingStatusDialog').modal('hide');
            _data_api.openMeeting(meetingID)
                .then(meeting => {
                    if (!meeting) {
                        return _data_api.getMeeting(meetingID);
                    } else {  //another meeting already open
                        let meetingDateText = moment(meeting.meetingDate).format("DD/MM/YY");
                        showError('There is already a meeting open for ' + meetingDateText + ' please close this first.');
                        throw new Error('Meeting already open');
                    }
                })
                .then(meeting => {
                    CURRENT_MEETING = meeting;
                    _render.meetingDetails(meeting);
                })
                .catch(err => console.log('Error: ' + err));
        });

        $('body').on('click', '.close-meeting', e => {
            let meetingID = $('#meetingChoices').val();
            $('#changeMeetingStatusDialog').modal('hide');
            _data_api.closeMeeting(meetingID)
                .then(() => { return _data_api.getMeeting(meetingID); })
                .then(meeting => {
                    CURRENT_MEETING = meeting.meetingDetails;
                    _render.meetingDetails(meeting);
                })
                .catch(err => console.log('Error: ' + JSON.stringify(err)));
        });

        //enlarge chart
        //------------------------------------------------------------------
        $('body').on('click', '.enlarge-chart', e => {
            $('#showFullResultsDialog').modal();
        });


        //enlarge meeting code
        //------------------------------------------------------------------
        $('body').on('click', '#meetingCode', e => {
            $('#largeMeetingCode').html($(e.currentTarget).find('span').html())
            $('#showMeetingCodeDialog').modal();
        });


        //TEST ONLY- reset all the questions
        //------------------------------------------------------------------
        $('body').on('click', '.open-all', e => {
            let id = $(e.currentTarget).data('meeting-id');
            $.ajax({
                url: 'https://api.epivote.uk/vote/ResetMeeting/' + id,
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                type: 'POST'
            })
                .done(() => console.log('Voting reset for all questions in this meeting'))
                .catch(err => console.log('Error: ' + JSON.stringify(err)));

        });

    }

    return {
        init: init
    };


})(DATA_API, RENDER, CONFIG);