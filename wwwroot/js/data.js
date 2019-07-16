var DATA_API = (function (_config) {

    function getResults(meetingPatientQuestionID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/GetResults/' + meetingPatientQuestionID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function getActiveQuestion(meetingID) {
        
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/GetCurrentQuestionForMeeting/' + meetingID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function completeVoteForQuestion(meetingPatientQuestionID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/VoteComplete/' + meetingPatientQuestionID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function openVoteForQuestion(meetingPatientQuestionID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/OpenVoteForQuestion/' + meetingPatientQuestionID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function getMeetings() {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/Getmeetings',
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function getMeeting(meetingID) {   
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/Getmeeting/' + meetingID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }


    function getSelectedMeeting(meetingID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/GetMeeting/' + meetingID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function getQuestionsForPatient(meetingPatientID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/GetQuestionsForPatient/' + meetingPatientID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function getQuestion(meetingPatientQuestionID) { 
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/GetQuestion/' + meetingPatientQuestionID,
            type: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function addNewQuestion(meetingPatientID, questionText) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/AddQuestion',
            type: 'POST',
            data: { meetingPatientID: meetingPatientID, questionText: questionText },
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function removeQuestion(meetingPatientQuestionID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/RemoveQuestion/' + meetingPatientQuestionID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function openMeeting(meetingID) {
      return   $.ajax({
          url: _config.urls.apiUrl + '/vote/OpenMeeting/' + meetingID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function closeMeeting(meetingID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/CloseMeeting/' + meetingID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function addMeeting(meetingDateTime) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/AddMeeting',
            type: 'POST',
            data: { meetingDate: meetingDateTime },
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    function releaseResults(meetingPatientQuestionID) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/ReleaseResults/' + meetingPatientQuestionID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    //send token to Firebase messanging to enable receiving messages
    function sendMessagingTokenToServer(token) {
        return $.ajax({
            url: _config.urls.apiUrl + '/vote/SetControlPanelToken/' + token,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    //authenticate with the web api
    function AuthenticateWithAPI() {
        return $.ajax({
            url: _config.urls.apiUrl + '/user/registerClient',
            type: 'POST',
            data: { ActivationCode: '0592' },
            success: (tokenPayload => {
                localStorage.setItem('token', tokenPayload.token.rawData);
            })
        });
    }

    //add new patient via the API
    function addNewPatient(meetingID) {
      return  $.ajax({
            url: _config.urls.apiUrl +  '/vote/AddPatient/' + meetingID,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    //***************LOCAL SYSTEM DATA CALLS***********************************
    //**************************************************************************
    function addPatientToLocalDB(hospitalNumber, firstname, surname, dob, meetingID, meetingPatientID, patientNumber) {
        return $.ajax({
            url: _config.urls.addToLocalDB,
            type: 'POST',
            data:
            {
                hospitalNumber: hospitalNumber,
                firstname: firstname,
                surname: surname,
                DOB: dob,
                meetingID: meetingID,
                meetingPatientID: meetingPatientID,
                patientNumber: patientNumber
            }    
        });
    }

    function getPatients(meetingID) {
        return $.getJSON(_config.urls.getPatients + '/' + meetingID);
    }


    function getPatientDetails(patientID) {
        return $.getJSON(_config.urls.getPatientDetails + '/' + patientID);
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
        addMeeting: addMeeting,
        sendTokenToServer: sendMessagingTokenToServer,
        AuthenticateWithAPI: AuthenticateWithAPI,
        releaseResults: releaseResults,
        removeQuestion: removeQuestion,
        addPatientToLocalDB: addPatientToLocalDB
      
    };

})(CONFIG);


