var RENDER = (function (data_api) {

    var CHART;


    //renderers
    function renderPatientDetails(patient) {

        return new Promise((resolve) => {
            $('#patientNumber').html('<h4 class="mb-2 mt-2"> Patient ' + patient.patientNumber + '</h4>');
            $('#hospitalNumber').html('<h4 class="mb-2 mt-2">' + patient.hospitalNumber + '</h4>');
            $('#patientName').html('<h4 class="mb-2 mt-2">' + patient.firstname + ' ' + patient.surname + '</h4>');
            $('#patientAge').html('<h4 class="mb-2 mt-2">' + patient.age + '</h4>');
            $('#patientDOB').html('<h4 class="mb-2 mt-2">' + moment(patient.dob).format('DD/MM/YY') + '</h4>');
            $('.patient-details').fadeIn('slow');
            //$('#patientDetails').html('<h4 class="mb-2 mt-2">' + patient.patientDetails + '</h4>');
            if (CHART) {
                CHART.destroy();
            }
            $('#score').html('');

            resolve(patient);
        });
    }

    function renderQuestionOpen(meetingPatientQuestionID) {
        $('#score').hide();
        $('.question-row, .pick-patient').not('.selected-patient').addClass('question-disabled');
        $('.question-row, .pick-patient').prop('disabled', true);
        $('.new-question').prop('disabled', true);
        $('#addNewPatient').prop('disabled', true);
        var html = '<h3>Question open for voting</h3><img style="height:150px;" src = "images/loader.gif" />';
        html += '<button class="btn mr-3 btn-block btn-primary complete-vote mb-2 mt-2" data-meeting-patient-question-id="'
            + meetingPatientQuestionID + '" > Close voting</button >';

        $('#score').show().html(html).fadeIn('slow');
    }

    function renderPatients(patients) {
        let meetingDate = $('#meetingChoices option:selected').html();
        $('#meetingDate').html('<h5 class="mr-2 mb-2 ml-2">Meeting date: ' + meetingDate + '</h5>');
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

    }

    function renderQuestions(questions, meetingPatientID) {
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
        if (CHART) {
            CHART.destroy();
        }
        if (!question.votingComplete) {
            $('#score').hide();
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
                    $('#score').html('Average score: ' + data.averageScore.toFixed(1));
                    renderChart(data.chartData);
                });
        }
    }

    function renderMeetingDetails(meeting) {

    }

    function renderChart(chartData) {

        if (CHART) {
            CHART.destroy();
        }

        CHART = new Chart($('#results'), {

            type: 'horizontalBar',
            data: {
                labels: ["Strongly agree", "Agree", "Neutral", "Disagree", "Stongly disagree"],
                datasets: [{
                    label: '',
                    data: chartData,
                    backgroundColor: [
                        '#39a16c',
                        '#bad530',
                        '#feac27',
                        '#ff8c33',
                        '#ff696a'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 12
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 17
                        }
                    }]
                }
            }
        });
    }


    return {
        patientDetails: renderPatientDetails,
        patients: renderPatients,
        questions: renderQuestions,
        questionOpen: renderQuestionOpen,
        questionResult: renderQuestionResult,
        chart: renderChart
    };
})(DATA_API);