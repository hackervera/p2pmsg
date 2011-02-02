<html>
<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>
<textarea id='tweet' cols=100></textarea><br>
<button id='ok'>Send message</button>

{{#tweets}}
<p>
Name: {{name}}<br>
Message: <b>{{message}}</b><br>
Timestamp: {{timestamp}}
</p>
{{/tweets}}
<script src='tweets.js'></script>

</html>
