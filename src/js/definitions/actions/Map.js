/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function MapAction(){/*** Map出撃系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
}

MapAction.prototype.forStart= function(){
    this.achievements.update().incrementMapCount();
}
