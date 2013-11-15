/***** class definitions *****/
function Quests(){
    // localStorageにある"quests"にアクセスするクラス
}
Quests.prototype = Object.create(MyStorage.prototype);
Quests.prototype.constructor = Quests;
// static
Quests.state = {
  YET  : 0,
  NOW  : 1,  
  DONE : 2 
};

Quests.prototype.embark = function(questId){
  return this._updateStateById(questId, Quests.state.NOW);
};
Quests.prototype.done = function(questId){
  return this._updateStateById(questId, Quests.state.DONE);
};
Quests.prototype.cancel = function(questId){
  return this._updateStateById(questId, Quests.state.YET);
};
Quests.prototype._updateStateById = function(questId, newState){
    this._resetDailyIfOutdated();
    var quests = this.get("quests") || this.init();
    if ( ! quests.map[questId]) return this;
    quests.map[questId].state = newState;
    quests.lastUpdated = Date.now();
    this.set("quests", quests);
    return this;
};
Quests.prototype._resetDailyIfOutdated = function() {
    return this._resetOutdatedByKey("daily");
};
Quests.prototype._resetOutdatedByKey = function(key){
    var criteriaRestTime = Util.getDailyResetTimestamp();
    var quests = this.get("quests") || this.init();
    if (criteriaRestTime <  quests.lastUpdated) return false;
    quests = this.init();
    this.set("quests", quests);
    return true;
};
Quests.prototype.haveUpdate = function(criteriaTime){
    var quests = this.get("quests") || this.init();
    if (criteriaTime < quests.lastUpdated) return true;
    return false;
};
Quests.prototype.getAll = function(){
    this._resetDailyIfOutdated();
    return this.get("quests") || this.init();
};
Quests.prototype.availables = function(){
    this._resetDailyIfOutdated();
    var all = this.get("quests").map || this.init().map;
    var availables = [];
    for (var i in all) {
        var q = all[i];
        // 依存するものがなければavailablesである
        if (q.required == null) {
            availables[q.id] = q;
            continue;
        }
        // 依存する任務が終わっていればavailablesである
        if (all[q.required].state == Quests.state.DONE) {
            availables[q.id] = q;
            continue;
        }
        // 依存するものがあり、依存する任務が終わっていないならavailablesではない
    }
    return availables;
};

Quests.prototype.init = function(){
    var initialValue = this.initialValue;
    initialValue.lastUpdated = Date.now();
    this.set("quests", initialValue);
    return this.get("quests");
};
Quests.prototype.initialValue = {
    lastUpdated : 0,//Date.now(),prototype定義内でのDate.nowはインスタンス化された時点が入る
    map : {
        // initDailyとか今後やらなあかんっぽいよなぁ
        // TODO: デイリーかウィークリーか判別するアレ =>  (　ﾟ∀ﾟ)o彡° YAGNI！YAGNI！
        // デイリー
        // 出撃
        201 : { title : "敵艦隊を撃破せよ！",             id : 201, required : null, state : Quests.state.YET},
        216 : { title : "敵艦隊主力を撃滅せよ！",         id : 216, required : 201,  state : Quests.state.YET},
        210 : { title : "敵艦隊を10回邀撃せよ！",         id : 210, required : 216,  state : Quests.state.YET},
        211 : { title : "敵空母を3隻撃沈せよ",            id : 211, required : 201,  state : Quests.state.YET},
        218 : { title : "敵補給艦を3隻撃沈せよ！",        id : 218, required : 216,  state : Quests.state.YET},
        226 : { title : "南西諸島海域の制海権を握れ！",   id : 226, required : 218,  state : Quests.state.YET},
        230 : { title : "敵潜水艦を制圧せよ！",           id : 230, required : 226,  state : Quests.state.YET},
        // 演習
        303 : { title : "「演習」で練度向上！",           id : 303, required : null, state : Quests.state.YET},
        304 : { title : "「演習」で他提督を圧倒せよ！",   id : 304, required : 303,  state : Quests.state.YET},
        // 遠征
        402 : { title : "「遠征」を3回成功させよう！",    id : 402, required : null, state : Quests.state.YET},
        403 : { title : "「遠征」を10回成功させよう！",   id : 403, required : 402,  state : Quests.state.YET},
        // 補給・入渠
        503 : { title : "艦隊大整備！",                   id : 503, required : null, state : Quests.state.YET},
        504 : { title : "艦隊酒保祭り！",                 id : 504, required : 503,  state : Quests.state.YET},
        // 工廠
        605 : { title : "新装備「開発」指令",             id : 605, required : null, state : Quests.state.YET},
        606 : { title : "新造艦「建造」指令",             id : 606, required : 605,  state : Quests.state.YET},
        607 : { title : "装備「開発」集中強化！",         id : 607, required : 606,  state : Quests.state.YET},
        608 : { title : "艦娘「建造」艦隊強化！",         id : 608, required : 607,  state : Quests.state.YET},
        609 : { title : "軍縮条約対応！",                 id : 609, required : 608,  state : Quests.state.YET},
        // 改装
        702 : { title : "艦の「近代化改修」を実施せよ！", id : 702, required : null, state : Quests.state.YET}
    }
};
