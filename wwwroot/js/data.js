var DATA_API = (function () {
    function getResults(meetingPatientQuestionID) {
        return $.getJSON('https://api.epivote.uk/vote/GetResults/' + meetingPatientQuestionID);
    }

    function getActiveQuestion(meetingID) {
        return $.getJSON('https://api.epivote.uk/vote/GetCurrentQuestionForMeeting/' + meetingID);
    }

    function completeVoteForQuestion(meetingPatientQuestionID) {
        return $.post('https://api.epivote.uk/vote/VoteComplete/' + meetingPatientQuestionID);
    }

    function openVoteForQuestion(meetingPatientQuestionID) {
        return $.post('https://api.epivote.uk/vote/OpenVoteForQuestion/' + meetingPatientQuestionID);
    }

    function getMeetings() {
     return $.ajax({
            url: 'https://api.epivote.uk/vote/Getmeetings',
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'           
        })
    }

    function getMeeting(meetingID) {
        return $.getJSON('https://api.epivote.uk/vote/Getmeeting/' + meetingID);
    }

    function getPatients(meetingID) {
        return $.getJSON(BASE_URL  + '/GetPatients/' + meetingID);
    }

    function getSelectedMeeting(meetingID) {
        return $.getJSON('https://api.epivote.uk/vote/GetMeeting/' + meetingID);
    }

    function getQuestionsForPatient(meetingPatientID) {
        return $.getJSON('https://api.epivote.uk/vote/GetQuestionsForPatient/' + meetingPatientID);
    }

    function getQuestion(meetingPatientQuestionID) {
        return $.getJSON('https://api.epivote.uk/vote/GetQuestion/' + meetingPatientQuestionID);
    }

    function addNewQuestion(meetingPatientID, questionText) {
        return $.post('https://api.epivote.uk/vote/AddQuestion', { meetingPatientID: meetingPatientID, questionText: questionText });
    }

    function openMeeting(meetingID) {
        return $.post('https://api.epivote.uk/vote/OpenMeeting/' + meetingID);
    }

    function closeMeeting(meetingID) {
        return $.post('https://api.epivote.uk/vote/CloseMeeting/' + meetingID );
    }

    function sendTokenToServer(token) {
        return $.post('https://api.epivote.uk/vote/SetControlPanelToken/' + token );
    }

    function AuthenticateWithAPI() {
        return $.post('https://api.epivote.uk/user/registerClient/' + '0592', token => {
            localStorage.setItem('token', token.token.rawData);
            console.log(token.token.rawData)
            //$.ajaxSetup({
            //    headers: { "Authorization": "Bearer " + token.token.rawData }
            //})
        })
    }

    function addNewPatient(hospitalNumber, firstname, surname, dob, meetingID) {
        return $.post(BASE_URL +'/AddPatient',
            {
                hospitalNumber: hospitalNumber,
                firstname: firstname,
                surname: surname,
                DOB: dob,
                meetingID: meetingID
            });
    }

    function getPatientDetails(patientID) {
        return $.getJSON(BASE_URL +'/GetPatientDetails/' + patientID);
    }

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        
    }

    return {
        getResults: getResults,
        getActiveQuestion: getActiveQuestion,
        completeVoteForQuestion: completeVoteForQuestion,
        openVoteForQuestion: openVoteForQuestion,
        getMeetings: getMeetings,
        getPatients: getPatients,
        getQuestionsForPatient: getQuestionsForPatient,
        getQuestion: getQuestion,
        getPatientDetails: getPatientDetails,
        getSelectedMeeting: getSelectedMeeting,
        addNewQuestion: addNewQuestion,
        addNewPatient: addNewPatient,
        openMeeting: openMeeting,
        closeMeeting: closeMeeting,
        getMeeting: getMeeting,
        sendTokenToServer: sendTokenToServer,
        AuthenticateWithAPI: AuthenticateWithAPI
    };

})();


