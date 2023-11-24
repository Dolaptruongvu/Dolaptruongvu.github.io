using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class HealthBar : MonoBehaviour
{
    public Image Fill;
    public TextMeshProUGUI textValue;

    public void UpdateBar(int currentValue, int maxValue)
    {
        Fill.fillAmount = (float)currentValue / (float)maxValue;
        textValue.text = currentValue.ToString() + " / " + maxValue.ToString();
    }
}
