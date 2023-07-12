# Discord Bot
#### New to programming. My first approach to a simple Discord.js Bot with Slash and prefix ! commands: 

<br>

## SLASH COMMANDS: 

### /evento
##### Triggers a dm message asking a Title and a Description for a "Yes", "No" and "Maybe" evenet. 
##### A embed is created where users can vote, the footer will show the 3 answers and the users that voted each one.

#

### /poll
##### Trigger a dm message asking the title/question of the poll and the options. To finish adding options "stop" should be typed.
##### The bot then asks how many options can each user chose from. 
##### A embed is created where users can vote.

#

### /monumentos 
##### Auto creates a pre-built embed with a Question and 13 options. Each user can chose 2.

#

## PREFIX COMMANDS: 
### !addcode <4-digitNumber>
##### Refreshes a json with the 4 digit number typed.

#

### !randomcode
##### Created a random 4 digit code and replaces the code stored in the json, if there's one. If not just stores it.

#

### !code
##### Consults the code stored in the json. If there's none user will be asked to create one.

#

### All commands are Role/User id limited.
