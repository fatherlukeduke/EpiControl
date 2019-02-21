var DATA_API = (function () {
    function getResults(meetingPatientQuestionID) {
         return $.ajax({
            url: 'https://api.epivote.uk/vote/GetResults/' + meetingPatientQuestionID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function getActiveQuestion(meetingID) {
        
        return $.ajax({
            url: 'https://api.epivote.uk/vote/GetCurrentQuestionForMeeting/' + meetingID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
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
        });
    }

    function getMeeting(meetingID) {
        
        return $.ajax({
            url:' https://api.epivote.uk/vote/Getmeeting/' + meetingID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function getPatients(meetingID) {
        return $.getJSON(BASE_URL  + '/GetPatients/' + meetingID);
    }

    function getSelectedMeeting(meetingID) {
        return $.getJSON('https://api.epivote.uk/vote/GetMeeting/' + meetingID);
    }

    function getQuestionsForPatient(meetingPatientID) {
        return $.ajax({
            url: 'https://api.epivote.uk/vote/GetQuestionsForPatient/' + meetingPatientID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function getQuestion(meetingPatientQuestionID) { 
        return $.ajax({
            url: 'https://api.epivote.uk/vote/GetQuestion/' + meetingPatientQuestionID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function addNewQuestion(meetingPatientID, questionText) {
        return $.post('https://api.epivote.uk/vote/AddQuestion', { meetingPatientID: meetingPatientID, questionText: questionText });
    }

    function openMeeting(meetingID) {
        return $.ajax({
            url: 'https://api.epivote.uk/vote/OpenMeeting/' + meetingID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function closeMeeting(meetingID) {
        return $.ajax({
            url: 'https://api.epivote.uk/vote/CloseMeeting/' + meetingID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function sendMessagingTokenToServer(token) {
        return $.ajax({
            url: 'https://api.epivote.uk/vote/SetControlPanelToken/' + token,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            dataType: 'json'
        });
    }

    function AuthenticateWithAPI() {
        return $.post('https://api.epivote.uk/user/registerClient/' + '0592', token => {
            localStorage.setItem('token', token.token.rawData);
            console.log(token.token.rawData);
        });
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
        sendTokenToServer: sendMessagingTokenToServer,
        AuthenticateWithAPI: AuthenticateWithAPI
    };

})();


