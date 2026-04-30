import { usePetStore } from './useStore';
import { useShallow } from 'zustand/react/shallow';

export function PetProfile() {
  // usamos o useShallow para extrair múltiplas propriedades.
  // sem ele, o componente poderia re-renderizar desnecessariamente 
  // toda vez que qualquer parte do store mudasse.
  const { catName, age } = usePetStore(
    useShallow((state) => ({
      catName: state.catName,
      age: state.age,
    }))
  );

  const increaseAge = usePetStore((state) => state.increaseAge);
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Perfil do Pet</h2>
      <p>Nome: <strong>{catName}</strong></p>
      <p>Idade: <strong>{age} anos</strong></p>
      
      <button onClick={increaseAge}>
        Fazer aniversário 🎂
      </button>
    </div>
  );
}



