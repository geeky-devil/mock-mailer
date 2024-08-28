const { all } = require('axios');
const { ProviderA, ProviderB } = require('./providers');

class EmailService {
  constructor() {
    this.providers = [new ProviderA(), new ProviderB()];
    this.currentProviderIndex = 0;
    this.sentEmails = new Map();
    this.lastSentTime = 0;
    this.rateLimitInterval = 1000*10;
    this.status = new Map();
    this.currentProvider=['ProviderA','ProviderB'];
  }

  getCurrentProvider() {
    return this.providers[this.currentProviderIndex];
  }

  switchProvider() {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
  }

  getProviderName(){
    return this.currentProvider[this.currentProviderIndex];
  }

  getMails() {
    return this.sentEmails;
  }

  async rateLimit() {
    //send mail with cooldown of 10 seconds 
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSentTime;
    if (timeSinceLastSend < this.rateLimitInterval) {
      console.log("Please wait for",this.rateLimitInterval-timeSinceLastSend,"ms");
      await sleep(this.rateLimitInterval-timeSinceLastSend);
    }
    this.lastSentTime = Date.now();
  }

  async send(email) {
    var to=email.to;
    var body=email.body;
    //check for duplicate mails 
    if (this.sentEmails.has(to)){
        if (this.sentEmails.get(to).has(body))
            {
                console.log("Duplicate mail found");
                return true;
            }
    }
    console.log(this.getProviderName());
    await this.rateLimit();

    const sendEmail = () => this.getCurrentProvider().sendEmail(email);

    let success = await retryWithExponentialBackoff(sendEmail);
    if (!success) {
      console.log("Max attempts reached, switching providers");
      this.switchProvider();
      success = await retryWithExponentialBackoff(sendEmail);
    }

    this.status.set(email.id, success ? "Success" : "Failure");
    if (success) {
        if (this.sentEmails.has(to)) this.sentEmails.get(to).add(body);
        else this.sentEmails.set(to,new Set().add(body));
        console.log(this.sentEmails); 
    }
    return success;
  }

  getStatus(emailId) {
    return this.status.get(emailId) || "Not sent";
  }
}
//retry with expBackoff
async function retryWithExponentialBackoff(fn, retries = 3, delay = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const success = await fn();
      if (success) return true;
    } catch (error) {
      attempt++;
      console.log("Attempt failed...Retrying");
      await sleep(delay * Math.pow(2, attempt));
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = EmailService;
