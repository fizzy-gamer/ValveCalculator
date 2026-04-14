//Main
document.getElementById("AddSplit").onclick = function() {AddSplit();};
document.getElementById("RemoveSplit").onclick = function() {RemoveSplit();};
document.getElementById("ClearSplits").onclick = function() {ClearSplits();};

var CurrentSplits = {};
var SplitButtons = document.getElementById("SplitButtons");
var BypassTexts = document.getElementById("BypassPercentages")

function Round15DP(Number){
  return (Math.round(Number*(10**15))/(10**15))*100;
};

function NewSplit(Name, Machines) {
  if (Machines == null) {Machines = 1;};

  CurrentSplits[Name] = Machines;
  let Button = document.createElement("button");
  Button.className = "SplitButton";
  Button.id = Name
  SplitButtons.appendChild(Button);

  Button.innerHTML = `<span class="GreyText"><u> Split ${Name} </u></span>`
  
  let MachineInput = document.createElement("input");
  MachineInput.className = "MachineInput";
  MachineInput.placeholder = "Machines";
  MachineInput.type = "number";
  MachineInput.step = "1";
  MachineInput.min = "0";
  if (Machines != 0) {MachineInput.value = Machines;};
  MachineInput.addEventListener("input", function(){CurrentSplits[Name] = parseFloat(MachineInput.value)!= NaN ? parseFloat(MachineInput.value): 0; UpdatePercentages();});
  Button.appendChild(MachineInput);
}

function AddSplit() {
  let TotalSplitButtons = SplitButtons.children.length;
  NewSplit(TotalSplitButtons +1);
  UpdatePercentages();
}
function RemoveSplit() {
  if (SplitButtons.children.length <= 0) {return;};
  let Button = SplitButtons.children[SplitButtons.children.length -1]
  delete CurrentSplits[Button.id];
  Button.remove();
  UpdatePercentages();
}
function ClearSplits() {
  Object.entries(SplitButtons.children).forEach(function(Button,_){
    Button[1].remove();
  });
  CurrentSplits = {};
  UpdatePercentages();
}

function UpdatePercentages() {
  Object.entries(BypassTexts.children).forEach(function(Text,_){
    Text[1].remove();
  });

  let MachineCount = 0;
  Object.entries(CurrentSplits).forEach(function(Data){
    MachineCount += Data[1];
  });

  if (MachineCount > 0) {
    Object.entries(CurrentSplits).forEach(function(Data){
      let TextFrame = document.createElement("div")
      TextFrame.className = "RateTexts"
      let Text = document.createElement("span")
      Text.className = "GreenText"
      Text.innerHTML = `${Data[0]} | ${Round15DP(Data[1]/MachineCount)}`
      TextFrame.appendChild(Text)
      MachineCount -= Data[1]
      BypassTexts.appendChild(TextFrame)
    });
  } else {
    let Text = document.createElement("div")
    Text.className = "RedText"
    Text.innerHTML = "Add splits to start calculating Bypass Percentages!"
    BypassTexts.appendChild(Text)
  };
}
UpdatePercentages();

//////////////////////////////////////////////////////////////
//Import Export
document.getElementById("ImportData").onclick = function() {document.getElementById("ImportMenu").style.display = "";};
document.getElementById("ExportData").onclick = function() {ExportClicked();};
document.getElementById("Import").onclick = function() {ImportClicked();};

document.getElementById('ImportMenu').addEventListener('click', function(event) {
  const Menu = document.getElementById('ImportBox');
  if (Menu && !Menu.contains(event.target)) {document.getElementById('ImportMenu').style.display = 'none';};
});

function ImportClicked() {
  let Input = document.getElementById("ImportDataInput");
  try {
    let Data = Input.value.split("🪠")
    let ExtractedData = {};

    ClearSplits();

    Data.forEach(SplitToImport => {
      if (SplitToImport == "") {return;};
      let CurrentSplit = JSON.parse(SplitToImport);
      if (CurrentSplit[1] == null) {return;};
      ExtractedData[CurrentSplit[0]] = CurrentSplit[1];
      NewSplit(CurrentSplit[0], CurrentSplit[1]);
    });

    CurrentSplits = ExtractedData;
    UpdatePercentages();

    document.getElementById('ImportMenu').style.display = 'none';
  } catch {
    Input.value = "Invalid, Try exporting to see format!";
  };
};

function ExportClicked() {
  let ExportText = "";
  Object.entries(CurrentSplits).forEach(function(Data){
    ExportText += JSON.stringify(Data)+"🪠\n";
  });
  navigator.clipboard.writeText(ExportText);
  document.getElementById("ExportData").innerText = "Copied to clipboard!";
  setTimeout(() => {
  document.getElementById("ExportData").innerText = "Export Data";
  }, 2000);
};