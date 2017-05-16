var Student = {
    // please fill in your name and NetID
    // your NetID is the part of your email before @princeton.edu
    'name'  : 'Ambika Viswanathan, Chris Hsu, Howard Tam, Mohamed El-Dirany',
    'netID' : 'ambikav, cjhsu, htam, mohamede',
};

Student.updateHTML = function( ) {
    var studentInfo = this.name + ' &lt;' + this.netID + '&gt;';
    document.getElementById('student').innerHTML = studentInfo;
}
