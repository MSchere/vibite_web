<script lang="ts">

    import {
        type Nutrients,
        type NutrientInfo,
        type Dish,
        NutrientNames,
    } from "$src/types/dish";
    export let selectedDish: Dish;

    function orderNutrients(nutrients: Nutrients): [string, NutrientInfo][] {
        const nutrientsArray = Object.entries(nutrients);
        const nutrientsOrder = [
            NutrientNames.ENERGY,
            NutrientNames.FAT,
            NutrientNames.SATFAT,
            NutrientNames.PROTEIN,
            NutrientNames.CARBS,
            NutrientNames.SUGAR,
            NutrientNames.FIBER,
            NutrientNames.SALT,
        ];
        const formattedNutrients = nutrientsOrder.map((nutrient) => {
            const nutrientValue = nutrientsArray.find(
                (nutrientArray) => NutrientNames[nutrientArray[0]] === nutrient,
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
            <td class="table-hint">Total</td>
        </tr>
        {#each orderNutrients(selectedDish?.nutrients) as nutrient}
            <tr class="d-flex gap-0-5">
                <td class="fw-bold">{`${NutrientNames[nutrient[0]]}:`}</td>
                <td>
                    {`${nutrient[1].value100} ${nutrient[1].unit}`}
                </td>
                <td>
                    {`${nutrient[1].valueTotal} ${nutrient[1].unit}`}
                </td>
            </tr>
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
