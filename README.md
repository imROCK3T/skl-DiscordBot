# Discord Bot
#### I'm new to programming. This is my first approach to a simple Discord.js Bot with Slash and prefix ! commands: 

#
### _SLASH COMMANDS_: 

### /evento
##### Triggers a dm message asking a _Title_ and a _Description_ for a "Yes", "No" and "Maybe" event. 
##### A embed is created where users can vote, the footer will show the 3 answers and the users that voted each one.

#

### /poll
##### Triggers a dm message asking the _Title/Question_ of the poll and the _options_ to add. To finish adding options "_stop_" should be typed.
##### The bot then asks how many options can each user choose from. 
##### A embed is created where users can vote.

#

### /monumentos 
##### Auto creates a pre-built embed with a Question and 13 options. Each user can choose 2 options.

#

## _PREFIX COMMANDS:_ 
### !addcode <_4-digitNumber_>
##### Refreshes a json with the 4 digit number typed.

#

### !randomcode
##### Creates a random 4 digit code and replaces the code stored in the json, if there's one. If not just stores it.

#

### !code
##### Consults the code stored in the json. If there's none user will be asked to create one.

#

### All commands are Role/User id limited.
