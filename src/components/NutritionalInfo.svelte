<script lang="ts">
    import { NutrientName, type Dish, type Nutrient, type NutrientInfo } from "$src/types/dish";
    export let selectedDish: Dish;

    function orderNutrients(nutrients: Nutrient): [string, NutrientInfo][] {
        const nutrientsArray = Object.entries(nutrients);
        const nutrientsOrder = [
            NutrientName.ENERGY,
            NutrientName.FAT,
            NutrientName.SATFAT,
            NutrientName.PROTEIN,
            NutrientName.CARBS,
            NutrientName.SUGAR,
            NutrientName.FIBER,
            NutrientName.SALT,
        ];
        const formattedNutrients = nutrientsOrder.map((nutrient) => {
            const nutrientValue = nutrientsArray.find(
                (nutrientArray) => NutrientName[nutrientArray[0].toUpperCase()] === nutrient,
            ) || [
                "NULL",
                {
                    unit: "",
                    valueTotal: 0,
                    value100: 0,
                },
            ];
            return nutrientValue;
        });
        return formattedNutrients;
    }
</script>

<table>
    <tbody>
        <tr>
            <td></td>
            <td class="table-hint">100g</td>
            <td class="table-hint">{`Total (${selectedDish.weight}g)`}</td>
        </tr>
        {#each orderNutrients(selectedDish?.nutrients) as nutrient}
            {#if nutrient[0] !== "NULL"}
                <tr class="flex gap-0-5">
                    <td class="fw-bold">{`${NutrientName[nutrient[0].toUpperCase()]}:`}</td>
                    <td>
                        {`${nutrient[1].value100.toFixed(2)} ${nutrient[1].unit}`}
                    </td>
                    <td>
                        {`${nutrient[1].valueTotal.toFixed(2)} ${nutrient[1].unit}`}
                    </td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<style lang="scss">
    table {
        display: table;
        margin: 0;
        border-collapse: collapse;
        border-spacing: 0;
    }

    tbody {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
    }

    tr {
        display: table-row;
    }
</style>
