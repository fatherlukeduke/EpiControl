﻿var RENDER = (function (data_api) {

    var BIG_CHART, CHART;

    //renderers
    function renderPatientDetails(patient) {

        return new Promise((resolve) => {
            $('.patient-details div').css('visibility', 'visible');
            $('#patientNumber').html('<h4 class="mb-2 mt-2"> Patient ' + patient.patientNumber + '</h4>');
            $('#hospitalNumber').html('<h4 class="mb-2 mt-2">' + patient.hospitalNumber + '</h4>');
            $('#patientName').html('<h4 class="mb-2 mt-2">' + patient.firstname + ' ' + patient.surname + '</h4>');
            $('#patientAge').html('<h4 class="mb-2 mt-2">' + patient.age + '</h4>');
            $('#patientDOB').html('<h4 class="mb-2 mt-2">' + moment(patient.dob).format('DD/MM/YY') + '</h4>');
            $('.patient-details div').fadeTo('slow', 1);
            //$('#patientDetails').html('<h4 class="mb-2 mt-2">' + patient.patientDetails + '</h4>');
            if (CHART) {
                CHART.destroy();
            }
            $('#score').html('');

            resolve(patient);
        });
    }

    function renderQuestionOpen(meetingPatientQuestionID) {
        let voteCount = ACTIVE_QUESTION ? ACTIVE_QUESTION.voteCount : '';
        $('#score').hide();
        $('#results').hide();
        $('.question-row, .pick-patient').not('.selected-patient').addClass('question-disabled');
        $('.question-row, .pick-patient').prop('disabled', true);
        $('.new-question').prop('disabled', true);
        $('#addNewPatient').prop('disabled', true);
        var html = '<h3>Question open for voting</h3>';
        html += '<div class="row><div class="col"><h2><span class="badge badge-pill  vote-count">Votes cast: ' + voteCount + '</span></h2></div></div>';
        html += '<img class="mx-auto" style="height:150px;" src = "images/loader.gif" />';
        html += '<button class="btn mr-3 btn-block btn-primary complete-vote mb-2 mt-2" data-meeting-patient-question-id="'
            + meetingPatientQuestionID + '" > Close voting</button >';

        $('#score').show().html(html).fadeIn('slow');
    }

    function renderPatients(patients) {
        if (patients.length >0) {

            let html = '<h3 style="display:inline-block" class="ml-2 mr-4">Patients: </h3>';
            $.each(patients, function (index) {
                html += '<button class="btn ml-2 patient-button  btn-success pick-patient"  data-patient-id="' +
                    this.patientID + '"  data-meeting-patient-id="' +
                    this.meetingPatientID + '">' + this.hospitalNumber + ' </button>';
            });
            html += '</div>';
            $('#patients').html(html);
            $('#test').html('<span data-meeting-id="' + patients[0].meetingID + '" class="open-all mt-5 test" > TEST: reset meeting</span > ');

            return patients[0].meetingID;
        } else {
            $('#patients').html('<h4>No patients added</h4>');
            return null;
        }
   
    }

    function renderQuestions(questions, meetingPatientID) {
        clearTimeout(AJAX_LOADER_TIMEOUT);
        $('#questions').hide();
        let html = '';
       // var id = questions[0].meetingPatientID;
        html += '<button class="btn mr-3 btn-block btn-primary new-question mb-2 mt-2" data-meeting-patient-id="' +
                meetingPatientID + '">Add new question</button>';

        html += '<ul class="list-group mt-2 mb-2" >';
        $.each(questions, function (index) {
            html += '<li data-meeting-patient-question-id="' + this.meetingPatientQuestionID + '" class="list-group-item question-row">';
            html += this.questionText;
            html += '</li>';        
        });
        html += '</ul>';

        $('#questions').html(html).fadeIn('slow');

        if (ACTIVE_QUESTION) {
            $('.question-row[data-meeting-patient-question-id="' + ACTIVE_QUESTION.meetingPatientQuestionID + '"]').trigger('click');
        }
       
    }

    function renderQuestionResult(question) {
        clearTimeout(AJAX_LOADER_TIMEOUT);

        if (!question.votingComplete) {
            $('#score').hide();
            $('#results').hide();
            var html = '<h3>This question has not been voted on</h3>';
            html += '<button data-meetingid="' + this.meetingID + '" data-meeting-patient-question-id="' +
                question.meetingPatientQuestionID + '" data-meeting-patient-id="' + question.meetingPatientID +
                '" class="btn btn-success btn-block mt-1 open-vote">Open voting</button>';
            $('#score').html(html).fadeIn('slow');
   
            if (question.votingOpen) {
                renderQuestionOpen(question.meetingPatientQuestionID);
            }
        } else {
            data_api.getResults(question.meetingPatientQuestionID)
                .then(data => {
                    let html = '<h2>Average score: ' + data.averageScore.toFixed(1) + '</h2>';
                    $('#score').html(html);
                    $('#bigScore').html(html);
                    $('#results').show();
                    renderChart(data.chartData);
                    //renderChart(data.chartData, 'bigChart');
                });
        }
    }

    function renderMeetingDetails(meeting) {
        $('.control-panel').show();

        let meetingDate = $('#meetingChoices option:selected').html();
        $('#meetingDate').html('<h4>Meeting date: ' + meetingDate + '</h4>');

        let meetingCode = $('#meetingChoices option:selected').data('meeting-code');
        $('#meetingCode').html('<h4>Meeting code: <span class="rounded-pill">' + meetingCode + '</span></h4>');

        let meetingStatus = $('#meetingChoices option:selected').data('meeting-status');
        ACTIVE_MEETING_STATUS = meetingStatus;
        let meetingStatusText = meetingStatus ? '<span class="meeting-open change-status rounded-pill">Open</span>'
                                                : '<span class="meeting-closed  change-status rounded-pill">Closed</span>';
        $('#meetingStatus').html('<h4>Meeting status: ' + meetingStatusText + '</h4>');

    }

    function renderChart(chartData) {

        if (CHART) {
            CHART.destroy();
        }
        if (BIG_CHART) {
            BIG_CHART.destroy();
        }

        CHART_CONFIG.data.datasets[0].data = chartData;

        CHART = new Chart($('#chart'), CHART_CONFIG);
        BIG_CHART = new Chart($('#bigChart'), CHART_CONFIG);
    }


    return {
        patientDetails: renderPatientDetails,
        meetingDetails: renderMeetingDetails,
        patients: renderPatients,
        questions: renderQuestions,
        questionOpen: renderQuestionOpen,
        questionResult: renderQuestionResult,
        chart: renderChart
    };
})(DATA_API);