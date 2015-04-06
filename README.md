# Meteor package adding some interaction in pres-jmpress

Add this package bring some interaction (actually quizzes) with your public.


## Installation

```
meteor add djedi:pres-interactions
```

Strongly depends on `djedi:pres-collections`


# Usage

Add in your presentation step the following informations:

```
  "steps": [
    {
      "interaction": {
        "type": "quiz",
        "data": {
          "question": "the question text",
          "responses": [
            {
              "k": "an unique key",
              "l": "response label"
            }
          ]
        }
	}
}]
```

