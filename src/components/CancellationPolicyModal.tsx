import React from 'react';

export const CancellationPolicyContent: React.FC = () => {
  return (
    <div>
      <p>
        Vážím si času každého klienta a péči, kterou věnuji přípravě jednotlivých setkání.
        Abychom společně mohli vytvářet prostor založený na respektu, důvěře a vzájemné zodpovědnosti,
        prosím o dodržování následujících storno podmínek.
      </p>

      <h4>1. Semináře a workshopy</h4>
      <ul>
        <li><strong>Zrušení 14 a více dní před konáním:</strong> Vrátím 100 % uhrazené částky.</li>
        <li><strong>Zrušení 7–13 dní před konáním:</strong> Vrátím 50 % uhrazené částky.</li>
        <li><strong>Zrušení méně než 7 dní před konáním:</strong> Uhrazená částka je nevratná.</li>
      </ul>
      <p>Pokud za sebe najdete náhradníka, je možné po předchozí domluvě převést rezervaci na něj.</p>
      <p>Pokud seminář nebo workshop zruším já, bude vám nabídnuta možnost převodu platby na jiný termín, nebo vrácení 100 % uhrazené částky.</p>

      <h4>2. Masáže a individuální sezení</h4>
      <p>V případě individuálních rezervací, včetně masáží a konzultací, platí následující podmínky:</p>
      <ul>
        <li><strong>Zrušení nebo změna termínu alespoň 48 hodin předem:</strong> Bez storno poplatku.</li>
        <li><strong>Zrušení méně než 48 hodin předem:</strong> Storno poplatek ve výši 50 % ceny rezervované služby.</li>
        <li><strong>Zrušení méně než 24 hodin předem nebo nedostavení se bez předchozí omluvy:</strong> Storno poplatek ve výši 100 % ceny rezervované služby.</li>
      </ul>
      <p>Pokud se nemůžete dostavit z důvodu náhlých a závažných okolností, prosím, kontaktujte mě co nejdříve. Každou takovou situaci se budu snažit řešit individuálně a s pochopením.</p>

      <h4>3. Jak rezervaci zrušit</h4>
      <p>Zrušení rezervace nebo žádost o změnu termínu mi prosím zašlete písemně prostřednictvím e-mailu nebo jiného komunikačního kanálu, přes který byla rezervace sjednána. Rozhodující je okamžik doručení zprávy.</p>

      <h4>4. Důležité informace</h4>
      <p>Rezervací služby potvrzujete, že jste se s těmito storno podmínkami seznámili.</p>
      <p>Storno podmínky upravují zrušení rezervace a je nutné je odlišovat od případného zákonného práva spotřebitele odstoupit od smlouvy. U rezervací uzavíraných online se mohou uplatnit zákonné výjimky a další povinnosti podle povahy konkrétní služby.</p>

      <p style={{ marginTop: '16px' }}>
        Děkuji za respektování mého času, práce a prostoru, který společně vytváříme.
      </p>

      <p style={{ marginTop: '12px' }}>
        S úctou,<br />
        <strong>Daniela Torp</strong>
      </p>
    </div>
  );
};
