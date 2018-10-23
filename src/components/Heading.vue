<template>
    <header>
        <div class="header">
            <img class="logo" src="../assets/msufcu_logo_white-01.svg" width="120" height="90">
            <div class="headTable">
                <p class="images"><img src="../assets/messages.png"><img src="../assets/manage.png"><router-link class="button" to="/">Sign Out</router-link></p>
                <p class="captions"><span class="alertCaption">Alerts</span><span class="manageCaption">Manage</span></p>
            </div>
            <h3>Transaction and Anomaly Monitoring</h3>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Heading',
    mounted() {
        console.log("header mounted");
    }
    
}
</script>

<style>
div.header {
    background-color: #004F39;
    text-align: left;
    color: #ffffff;
}
img.logo {
    margin-left: 2em;
    float: left;
}
div.header h3 {
    color: #ffffff;
    padding-left: 2em;
    margin-bottom: 0;
    margin-top: 0;
}
a.alerts {
    background-image: url('../assets/messages.png');
    height: 160px;
    
}
div.headTable {
    text-align: right;
    margin-right: 3em;
    padding-top: 1em;
}
div.headTable img {
    margin-left: 1em;
    margin-right: 1em;
}
p.captions {
    margin-top: 0;
    margin-bottom: 0;
}
p.images {
    margin-bottom: 0;
}
p.images img {
    margin-right: 2em;
}
a.button {
    color: #ffffff;
    border: solid 0.1em #ffffff;
    text-decoration: none;
    display: inline-block;
    vertical-align: top;
    margin-top: 0.2em;
    padding: 0.5em 0.5em 0.5em 0.5em;
}
span.alertCaption {
    margin-right: 2.4em;
}
span.manageCaption {
    margin-right: 6.5em;
}



</style>