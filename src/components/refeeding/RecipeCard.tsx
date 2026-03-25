import { useState } from 'react';
import { Card } from '../common/Card';
import type { RefeedingRecipe } from '../../constants/recipes';

export function RecipeCard({ recipe }: { recipe: RefeedingRecipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card onClick={() => setExpanded(!expanded)} className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-deep-ocean">{recipe.name}</h4>
          <p className="text-xs text-text-secondary mt-0.5">{recipe.phase} — {recipe.prepTime}</p>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-text-secondary transition-transform flex-shrink-0 mt-1 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <p className="text-xs text-text-secondary mt-2">{recipe.description}</p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-morning-mist space-y-3">
          <div>
            <h5 className="text-xs font-bold text-deep-ocean mb-1">Ingredients</h5>
            <ul className="text-xs text-text-secondary space-y-0.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-still-water mt-0.5">•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-deep-ocean mb-1">Instructions</h5>
            <ol className="text-xs text-text-secondary space-y-1">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="bg-morning-mist text-still-water w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-morning-mist rounded-lg p-2.5">
            <p className="text-xs text-deep-ocean">
              <span className="font-medium">Tip:</span> {recipe.tips}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
