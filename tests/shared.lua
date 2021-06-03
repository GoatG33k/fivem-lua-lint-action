-- shared
CreateThread(function() end)
Citizen.CreateThread(function() end)
SetTimeout(0, function() end)
Citizen.SetTimeout(0, function() end)
Await(function() end)
Citizen.Await(function() end)
Wait(0)
Citizen.Wait(0)
Trace()
Citizen.Trace()
Citizen.InvokeNative(0x000000)
-- events
AddEventHandler('', function() end)
RegisterNetEvent('', function() end)
TriggerEvent('')
RemoveEventHandler(function() end)
-- exports
exports.example:test()