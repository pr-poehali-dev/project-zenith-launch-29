export default function Featured() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="https://cdn.poehali.dev/projects/cc9e24c8-79d4-4d7f-9705-e24fb10d594c/files/f2be80f8-81bd-4f0e-8720-56ee5d420f11.jpg"
          alt="Person using HearGuard app"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1" id="features">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Твой слух под защитой</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          HearGuard в реальном времени анализирует уровень децибел в наушниках и предупреждает, когда громкость становится опасной для слуха.
        </p>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-neutral-400 text-xs uppercase tracking-wide w-24 shrink-0 mt-1">Мониторинг</span>
            <p className="text-neutral-700">Постоянный контроль уровня звука — даже в фоне</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neutral-400 text-xs uppercase tracking-wide w-24 shrink-0 mt-1">Уведомления</span>
            <p className="text-neutral-700">Умные оповещения при превышении безопасного порога</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neutral-400 text-xs uppercase tracking-wide w-24 shrink-0 mt-1">Аналитика</span>
            <p className="text-neutral-700">История нагрузки на слух — по дням, неделям, месяцам</p>
          </div>
        </div>
        <button className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Узнать больше
        </button>
      </div>
    </div>
  );
}